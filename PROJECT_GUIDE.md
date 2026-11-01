# DevColab Project Guide

## 1. Project architecture

DevColab is a JavaScript MERN application. The React single-page application
handles navigation and user interactions; its service modules call an Express
API. Express controllers use Mongoose models to read and write MongoDB. Socket.IO
provides live project chat, while GitHub OAuth supplies identity and the GitHub
API supplies public profile and repository data.

```text
Browser
  React 19 + Vite
  ├── Pages and shared layout
  ├── Feature services (Axios)
  ├── localStorage: JWT + user summary
  └── Socket.IO client
       │ HTTP /api/*       │ Socket.IO events
       ▼                   ▼
Express 5 + Socket.IO server
  ├── Routes → auth middleware → controllers
  ├── MongoDB access through Mongoose models
  └── GitHub OAuth / GitHub REST API
       │
       ├── MongoDB: users, projects, applications, messages
       └── GitHub: OAuth and public profile/repository data
```

### Repository map

```text
devCollab-app/
├── package.json                 # Root scripts to run frontend and backend
├── README.md                    # Product overview and quick start
├── PROJECT_GUIDE.md             # Architecture and workflow reference
├── frontend/
│   ├── index.html               # Vite HTML entry
│   ├── vite.config.js            # React and Tailwind Vite plugins
│   └── src/
│       ├── main.jsx              # React root and global CSS entry
│       ├── App.jsx               # Client-side route table
│       ├── assets/ProtectedRoutes.jsx
│       ├── components/           # Navbar, sidebar, layout, suggestions
│       ├── pages/                # Screens for each user journey
│       ├── services/             # Axios calls grouped by feature
│       ├── App.css
│       └── index.css             # Tailwind import
└── backend/
    ├── index.js                  # Express app, API mounts, Socket.IO startup
    ├── db/db.js                  # MongoDB connection
    ├── routes/                   # HTTP endpoint definitions
    ├── controllers/              # Request handling and persistence logic
    ├── middlewares/              # JWT authentication for protected routes
    ├── models/                   # Mongoose schemas
    └── utils/                    # GitHub API helpers and regex escaping
```

### Runtime request flow

1. `frontend/src/main.jsx` mounts `App.jsx`, which declares the SPA routes.
2. Pages invoke feature functions from `frontend/src/services/`. The service
   modules build URLs from `VITE_API_URL` and attach the locally stored JWT when
   available.
3. Express mounts routers under `/api`. Protected routes pass through
   `auth.middleware.js`, which verifies the bearer token and puts its decoded
   user ID on `req.user`.
4. Controllers validate ownership or request state where implemented, then use
   the corresponding Mongoose model. JSON responses update the page state.
5. Chat history is loaded over HTTP; live chat uses an authenticated Socket.IO
   connection and project rooms.

## 2. Data model

| Model | Main fields and relationships |
|---|---|
| `User` | GitHub ID, username, email, avatar, GitHub/LinkedIn/portfolio links, skills, profile-complete flag; timestamps. |
| `Project` | Title, description, domain, required skills, owner (`User` reference), application references, status (defaults to `Open`); timestamps. |
| `Application` | Project and applicant (`Project`/`User` references), optional message, status (defaults to `Pending`); timestamps. |
| `Message` | Sender (`User`), optional receiver (`User`), project (`Project`), message content; timestamps. Chat is project-scoped. |

Application status values used by the UI and API are `Pending`, `Accepted`, and
`Rejected`. Project status defaults to `Open`; the feed displays projects
regardless of status.

## 3. User workflows

### Sign in and profile onboarding

1. A visitor opens `/login` and chooses GitHub sign-in.
2. The browser navigates to `GET /api/auth/github`. The backend redirects to
   GitHub OAuth; GitHub returns to `GET /api/auth/github/callback`.
3. The backend exchanges the OAuth code, finds or creates the user, signs a
   seven-day JWT, then redirects to the frontend callback with the token and a
   user summary.
4. `GitHubCallback.jsx` saves both values in `localStorage`. Users who have not
   completed their profile go to `/complete-profile`; other users return to the
   originally requested path (or `/`).
5. Profile completion requires at least one skill and optionally accepts
   LinkedIn and portfolio links. The frontend submits the fields to
   `PATCH /api/users/complete-profile`; the backend saves them and sets
   `isProfileComplete`.

Protected pages require a token. The protected-route wrapper redirects
unauthenticated visitors to `/login` and redirects signed-in users with an
incomplete profile to `/complete-profile`. Logging out removes the local user
and token.

### Find and inspect projects

1. `/` loads a paginated project feed through `GET /api/projects?page=…&limit=…`.
2. Entering a search in the navbar navigates to `/?search=…`. The homepage calls
   `GET /api/projects/search?query=…`; the backend performs a case-insensitive
   search over title, description, domain, and required skills.
3. The project detail page (`/projects/:projectId`) loads project data through
   `GET /api/projects/:projectId`.
4. The shared right panel requests up to 50 projects and shows up to five whose
   required skills exactly match the signed-in user's skills. If none match,
   it shows the first five projects from that result set.

### Post and manage projects

1. From `/projects/createProject`, the user enters a title, description,
   domain, and comma-separated skills. The page turns the skill string into an
   array and submits `POST /api/projects`.
2. The backend assigns the authenticated user as owner. The project appears in
   the public feed and in `/dashboard`.
3. The dashboard loads owned projects from `GET /api/projects/myProjects` and
   links to `/myProjects/:projectId` to review applications.
4. Owners can change project fields or delete a project through
   `PATCH /api/projects/:projectId` and `DELETE /api/projects/:projectId`.
   Both operations check project ownership. Deleting a project also deletes its
   applications and messages.

### Apply and review applications

1. A signed-in user opens a project and submits an optional cover message using
   `POST /api/projects/:projectId/apply`.
2. The backend creates a `Pending` application and adds its ID to the project's
   application list. A second application by the same user for that project is
   rejected.
3. Applicants see their submissions at `/applications`; the page loads
   `GET /api/myApplications` and displays status and project details.
4. The owner workflow uses `/myProjects/:projectId`. The backend populates each
   application with the applicant's username, skills, email, and profile links.
5. The owner accepts or rejects a pending application with
   `PATCH /api/projects/:projectId/applications/:applicationId`. The API checks
   project ownership and the requested status value.

The application-list endpoint requires a JWT but does not currently verify
that the requesting user owns the project. The intended UI workflow is for the
owner to review applications; the API does not enforce that ownership check on
the list request.

### Project chat

1. The accepted-application view offers a link to `/chat/:projectId`. The
   `/messages` page lists project conversations based on the user's messages.
2. On entering a chat, the page connects to Socket.IO using the local JWT,
   requests saved history through
   `GET /api/projects/:projectId/messages`, and loads the project title.
3. The client emits `joinRoom` with the project ID. The intended send path emits
   `sendMessage`; the server stores it as a `Message` and emits `receiveMessage`
   to sockets in that project room.
4. The client appends received messages and disconnects its socket when leaving
   the page. The backend also exposes REST message creation at
   `POST /api/projects/:projectId/messages`; the chat screen uses Socket.IO for
   sending.

There is a current sender-ID mismatch in the live path: OAuth signs the JWT with
an `id` claim, but Socket.IO authentication reads `decoded.Id`. As a result,
`socket.userId` is undefined and saving a socket message fails because
`Message.senderId` is required. The chat page can still load persisted history,
but live sends need the claim names aligned before this workflow works.

The interface only offers the chat link from an accepted application, but
Socket.IO event handlers currently authenticate the connection without checking
project membership or application status. Treat the UI condition as navigation
behavior, not a server-side access-control guarantee.

### Profiles, GitHub data, and settings

- `/profile/:userId` loads the application profile from
  `GET /api/users/:userId` and GitHub data from
  `GET /api/github/:userId/userProfile`. The GitHub helper retrieves public
  profile details and up to 50 repositories, then counts repository primary
  languages. The page shows skills, GitHub statistics, languages, and up to six
  repositories.
- `/settings` saves username, email, and skills through `PATCH /api/users/update`.
  It can delete the signed-in user's account through `DELETE /api/users/delete`.
- Notification and privacy toggles are currently page-local UI state; no
  backend persistence is connected to those controls.
- The conversation list groups message records by project. Its current
  grouping uses a populated project object as a map key, which can collapse
  messages into one displayed conversation instead of grouping by project ID.

## 4. Frontend routes

| Path | Page | Access |
|---|---|---|
| `/` | Project feed and search | Public |
| `/login` | GitHub sign-in | Public |
| `/auth/callback` | OAuth callback | Public |
| `/complete-profile` | Profile onboarding | Signed in |
| `/projects/:projectId` | Project detail and apply | Signed in |
| `/projects/createProject` | Create project | Signed in |
| `/dashboard` | Owned projects and application counts | Signed in |
| `/myProjects/:projectId` | Review applications | Signed in |
| `/applications` | Current user's applications | Signed in |
| `/chat/:projectId` | Project chat | Signed in |
| `/messages` | Conversation list | Signed in |
| `/profile/:userId` | User and GitHub profile | Signed in |
| `/settings` | Profile settings and account deletion | Signed in |

Signed-in pages (except profile onboarding) use the shared `Layout`: navbar,
sidebar, main page area, and suggested-project panel.

## 5. HTTP API and realtime events

All HTTP endpoints below are prefixed with `/api`. “JWT” means the route uses
the bearer-token authentication middleware.

| Method | Path | Purpose | Auth |
|---|---|---|---|
| GET | `/auth/github` | Begin GitHub OAuth | No |
| GET | `/auth/github/callback` | Complete OAuth and redirect to frontend | No |
| GET | `/projects` | Paginated project feed | No |
| GET | `/projects/search?query=…` | Search project text and skills | No |
| GET | `/projects/:projectId` | Read a project | No |
| POST | `/projects` | Create a project | JWT |
| GET | `/projects/myProjects` | List current user's projects | JWT |
| PATCH | `/projects/:projectId` | Update owned project | JWT |
| DELETE | `/projects/:projectId` | Delete owned project and related applications/messages | JWT |
| POST | `/projects/:projectId/apply` | Apply to a project | JWT |
| GET | `/myApplications` | List current user's applications | JWT |
| GET | `/projects/:projectId/applications` | List project applications | JWT |
| PATCH | `/projects/:projectId/applications/:applicationId` | Change application status | JWT |
| GET | `/projects/:projectId/messages` | Load project message history | JWT |
| POST | `/projects/:projectId/messages` | Create a message over HTTP | JWT |
| GET | `/user/messages` | List messages involving current user | JWT |
| GET | `/users/:userId` | Read a user profile | JWT |
| PATCH | `/users/update` | Update username, email, avatar, or skills | JWT |
| PATCH | `/users/complete-profile` | Save onboarding profile fields | JWT |
| DELETE | `/users/delete` | Delete current user account | JWT |
| GET | `/github/:userId/userProfile` | Retrieve GitHub profile, repos, and languages | JWT |

Socket.IO uses the server origin (the same value as `VITE_API_URL`). The
handshake authenticates with a JWT. Events used by chat are:

| Direction | Event | Data / behavior |
|---|---|---|
| Client → server | `joinRoom` | Project ID; joins that Socket.IO room |
| Client → server | `sendMessage` | Project ID, optional receiver ID, and content; persists and broadcasts |
| Server → clients | `receiveMessage` | Saved message emitted to the project room |

## 6. Local development

### Requirements

- Node.js and npm
- MongoDB connection string
- GitHub OAuth app credentials for sign-in
- A frontend origin matching the backend's `CLIENT_URL`

### Configure environment

Create `backend/.env`:

```env
PORT=8000
MONGO=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
CLIENT_URL=http://localhost:5173
GITHUB_CLIENT_ID=your_github_oauth_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_client_secret
```

Set the GitHub OAuth app callback URL to
`http://localhost:8000/api/auth/github/callback`. Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:8000
```

If you change either local port, keep the frontend API URL, backend
`CLIENT_URL`, and GitHub OAuth callback URL consistent with the actual origins.
Never commit `.env` files or real credentials.

### Install and run

From the repository root:

```bash
npm install
npm install --prefix backend
npm install --prefix frontend
npm run dev
```

The root `dev` script starts the backend and frontend concurrently. To run them
independently, use `npm run dev --prefix backend` and
`npm run dev --prefix frontend`. The backend also has a production-style
`npm start --prefix backend`; the frontend has `npm run build --prefix frontend`,
`npm run lint --prefix frontend`, and `npm run preview --prefix frontend`.

## 7. Implementation notes

- The backend reads `MONGO` for the database connection and defaults `PORT` to
  `8000`. Configure CORS and Socket.IO origins through `CLIENT_URL`.
- Frontend API calls use `VITE_API_URL`; the backend API is mounted at `/api`.
- The root package script uses `concurrently`; install dependencies at the root
  and in each app directory before running it.
- The backend does not currently declare a test script. The frontend provides
  lint and production-build scripts.

## 8. Source-module reference

Use this section to locate the implementation layer responsible for a change.
The source files remain the definitive behavior; this reference summarizes
their current responsibilities.

### Frontend entry, routing, and shared UI

| File | Responsibility |
|---|---|
| `frontend/src/main.jsx` | Imports global CSS and mounts the React app in `#root` using `StrictMode`. |
| `frontend/src/App.jsx` | Defines all React Router routes and wraps application pages in the shared layout and, where needed, the protected-route component. |
| `frontend/src/assets/ProtectedRoutes.jsx` | Reads the token and user summary from local storage; redirects to login or profile completion. |
| `frontend/src/components/Layout.jsx` | Provides the common navbar, left sidebar, page content, and right suggestion panel. |
| `frontend/src/components/Navbar.jsx` | Project search navigation, links to messages/applications, and logged-out login link. Search submits on Enter. |
| `frontend/src/components/Sidebar.jsx` | Home, create-project, applications, dashboard, profile, and logout/login navigation; displays the local user summary. |
| `frontend/src/components/RightPanel.jsx` | Fetches the first 50 projects and selects up to five skill matches, falling back to the first five. |
| `frontend/src/index.css` | Imports Tailwind CSS v4. |
| `frontend/src/App.css` | App-specific stylesheet; currently contains no app rules. |

### Frontend pages

| File | Screen behavior and primary dependencies |
|---|---|
| `frontend/src/pages/Homepage.jsx` | Fetches a paginated feed or search results; renders project cards, loading/empty states, and pagination. Uses project services. |
| `frontend/src/pages/Login.jsx` | Starts GitHub OAuth and saves the intended return path in session storage; shows OAuth failure query state. |
| `frontend/src/pages/GitHubCallback.jsx` | Parses the callback token and user query values, persists them, routes to onboarding or the saved return path. |
| `frontend/src/pages/CompleteProfile.jsx` | Requires a non-empty skills field, splits comma-separated skills, submits onboarding, updates the local user summary. |
| `frontend/src/pages/CreateProject.jsx` | Collects project text fields and comma-separated skills, submits a new project, navigates to the feed after success. |
| `frontend/src/pages/Project.jsx` | Loads a project by URL ID and submits a cover-message application; displays duplicate-application feedback. |
| `frontend/src/pages/Dashboard.jsx` | Loads the signed-in user's projects and derives totals from project and application-reference arrays. |
| `frontend/src/pages/ProjectApplications.jsx` | Loads applicants for one project and provides accept/reject actions for pending items. |
| `frontend/src/pages/MyApplications.jsx` | Loads the signed-in user's applications, displays status, and links accepted applications to project chat. |
| `frontend/src/pages/Chat.jsx` | Opens an authenticated Socket.IO connection, loads project/message history, joins a room, sends and displays messages. |
| `frontend/src/pages/MyChats.jsx` | Loads the user's message records, groups them for a conversation list, and routes to the project chat. |
| `frontend/src/pages/UserProfilePage.jsx` | Loads a user's app profile and GitHub profile/repository data; provides links and an edit shortcut for the current user. |
| `frontend/src/pages/Settings.jsx` | Saves profile fields and deletes the account; notification/privacy toggles are local component state only. |

### Frontend API services

Each service uses Axios and reads `VITE_API_URL`. Most create an Axios instance
Each service uses Axios and reads `VITE_API_URL`. Most create an Axios instance
whose request interceptor reads the JWT from `localStorage` and adds it to the
HTTP Authorization bearer header.

| File | Exported operations and corresponding backend route |
|---|---|
| `frontend/src/services/auth.services.js` | `initiateGithubLogin()` redirects to `/api/auth/github`. The login page currently performs this redirect directly instead. |
| `frontend/src/services/project.services.js` | `getProjects` → `GET /projects`; `searchProjects` → `GET /projects/search`; `getProjectById` → `GET /projects/:id`; `createProject` → `POST /projects`; `updateProject` → `PATCH /projects/:id`; `deleteProject` → `DELETE /projects/:id`; `getProjectsByOwner` → `GET /projects/myProjects`. |
| `frontend/src/services/application.services.js` | `applyToProject` → `POST /projects/:id/apply`; `getApplicationsByProject` → `GET /projects/:id/applications`; `updateApplicationStatus` → `PATCH /projects/:id/applications/:applicationId`; `getMyApplications` → `GET /myApplications`. |
| `frontend/src/services/message.services.js` | `getMessagesByProject` → `GET /projects/:id/messages`; `getMessagesByUser` → `GET /user/messages`. |
| `frontend/src/services/user.services.js` | `fetchUserById` → `GET /users/:id`; `updateUserProfile` → `PATCH /users/update`; `deleteUser` → `DELETE /users/delete`; `completeUserProfile` → `PATCH /users/complete-profile`. |
| `frontend/src/services/github.services.js` | `fetchGithubData` → `GET /github/:userId/userProfile`. |

### Backend routing and request lifecycle

| File | Responsibility |
|---|---|
| `backend/index.js` | Loads dotenv, configures Express JSON and CORS, registers API routers, connects MongoDB, creates the HTTP/Socket.IO server, authenticates sockets, and handles chat events. |
| `backend/db/db.js` | Connects Mongoose to `process.env.MONGO`; logs a connection failure and exits. |
| `backend/middlewares/auth.middleware.js` | Reads the bearer token, verifies it using `JWT_SECRET`, stores decoded JWT claims on `req.user`, and returns 401 on absent/invalid token. |
| `backend/routes/auth.routes.js` | Public `GET /github` and `GET /github/callback`. |
| `backend/routes/project.routes.js` | Public project list/search/detail routes and authenticated create/owner-list/update/delete routes. |
| `backend/routes/application.routes.js` | Authenticated application creation, project application listing/status update, and current-user application listing. |
| `backend/routes/message.routes.js` | Authenticated HTTP message create/list routes. |
| `backend/routes/user.routes.js` | Authenticated user read/update/profile-completion/delete routes. |
| `backend/routes/github.routes.js` | Authenticated GitHub-data route. |
| `backend/controllers/auth.controller.js` | `githubAuth` redirects to GitHub; `githubCallback` exchanges the OAuth code, finds/creates a user, signs the JWT, and redirects with callback data. |
| `backend/controllers/project.controller.js` | `createProject`, `getAllProjects`, `getProjectById`, `updateProject`, `deleteProject`, `searchProjects`, and `getProjectsByOwner`; includes pagination, ownership checks, and dependent-record cleanup on project deletion. |
| `backend/controllers/application.controller.js` | `createApplication`, `getApplicationsByProject`, `updateApplicationStatus`, and `getMyApplications`; includes duplicate prevention, populated display data, status validation, and owner check on status updates. |
| `backend/controllers/message.controller.js` | `createMessage`, `getMessagesByProject`, and `getMessagesByUser`; HTTP message creation and history queries with sender/project population. |
| `backend/controllers/user.controller.js` | `getUserById`, `updateUser`, `deleteUser`, and `completeProfile`; profile read/update/delete/onboarding operations. |
| `backend/controllers/github.controller.js` | `fetchGithubData` loads an app user, derives their GitHub username, and combines profile, repositories, and language counts. |
| `backend/utils/github.js` | GitHub REST API requests and response projection for profile/repositories/language counts. |
| `backend/utils/escapeRegex.js` | Escapes user search text before it is embedded in a MongoDB regular expression. |

### Schemas and support configuration

| File | Notes |
|---|---|
| `backend/models/User.js` | User identity and public profile fields; unique required GitHub ID; timestamps. |
| `backend/models/Project.js` | Project description and skills; required owner reference; application ID list; default `Open`; timestamps. |
| `backend/models/Application.js` | Project and applicant references, optional message, default `Pending`; timestamps. |
| `backend/models/Message.js` | Required sender/project/content, optional receiver; timestamps. |
| `frontend/vite.config.js` | Vite React and Tailwind plugins. |
| `frontend/eslint.config.js` | JavaScript/JSX ESLint configuration with recommended JS, React Hooks, and React Refresh rules. |
| `frontend/vercel.json` | Rewrites all paths to `index.html` so the Vercel-hosted SPA can handle client routes. |
| `frontend/index.html` | Vite HTML shell and `#root` mount node. |
| `package.json`, `backend/package.json`, `frontend/package.json` | Root concurrency scripts and app-specific dependency/run/build/lint scripts. |
| `README.md` | User-facing product overview and quick start; links here for fuller technical reference. |
| `frontend/README.md` | Unmodified Vite starter-template instructions; not the DevColab architecture source. |
| `.gitignore`, `frontend/.gitignore` | Ignore dependencies, build output, local environment files/logs, and common editor files. |
| `frontend/public/favicon.svg`, `frontend/public/icons.svg` | Static browser assets. |

Lockfiles pin dependency resolutions; normally change manifests through the
package manager and commit the corresponding lockfile updates. `node_modules`,
build output, and local `.env` files are not project source.

## 9. Request contracts and persistence behavior

This section captures the current request shapes that are useful when changing
the UI and API together. Required schema fields are noted; UI form labels do not
always enforce the same requirements.

| Operation | Request body / query | Persistence and response notes |
|---|---|---|
| Create project | `title`, `description`, `domain`, `requiredSkills[]`, optional `status`; owner is derived from JWT. | Returns the created project with status defaulting to `Open`. Schema requires title, description, domain, skills, owner. |
| Search projects | Query parameter `query`. | Empty/whitespace query returns 400. Search is case-insensitive across title, description, domain, and required-skill values. |
| Apply | Optional `message`; project ID comes from URL and applicant ID from JWT. | Rejects an existing project/applicant pair with 400; creates `Pending` record and pushes ID onto the project's `applications` array. |
| Update application | `status` must be `Accepted`, `Rejected`, or `Pending`; project and application IDs in URL. | Checks project ownership, then changes application status. |
| Complete profile | `skills[]`, `linkedinLink`, `portFolioLink`. | Sets `isProfileComplete: true`; controller does not independently require non-empty skills. |
| Update user | Only `userName`, `email`, `avatar`, and `skills` are allowed. | Rejects unknown keys; uses current JWT identity. |
| Create HTTP message | `projectId`, `content`, optional `receiverId`. | Sender comes from JWT. This endpoint exists separately from the Socket.IO send path. |
| Socket message | `projectId`, `content`, optional `receiverId`. Client also sends `senderId`, but server is intended to derive sender identity from the authenticated socket. | Current socket identity claim mismatch is documented in the chat workflow above. |

The backend returns controller-specific JSON errors for many route failures
(for example 400, 401, 403, and 404); unexpected controller errors generally
return status 500 with the error message. There is no shared application-wide
error middleware or request-validation library in the current source.

### Data lifecycle boundaries

- Deleting a project explicitly deletes its `Application` and `Message`
  documents after deleting the project. This is not a MongoDB transaction.
- Deleting a user only deletes that `User` document in the current controller;
  related projects, applications, and messages are not cleaned up there.
- Changing an application's status does not automatically change project status
  or trigger notifications.
- Project `applications[]` is maintained when applying, but deleting an
  individual application or deleting a user does not reconcile this array.
- GitHub profile/repository details are fetched when the profile is viewed; the
  backend does not cache those responses in MongoDB.

## 10. Authentication and state model

### Browser state

| Storage | Current use | Lifetime |
|---|---|---|
| `localStorage.token` | JWT used by protected routes, Axios interceptors, and Socket.IO handshake. | Persists across reloads until logout/account deletion or browser storage is cleared; token itself expires after seven days. |
| `localStorage.user` | Serialized profile summary used by navigation, forms, and profile ownership display. | Updated on OAuth callback, profile completion, and settings save; may become stale when another user updates the same record. |
| `sessionStorage.redirectAfterLogin` | Return path captured by the login screen and consumed by the OAuth callback. | Current browser tab/session. |
| React component state | Loading flags, forms, fetched records, errors, local setting toggles, and chat messages. | Component lifetime; most fetched data reloads on mount. |

### JWT identity and roles

OAuth signs claims as `{ id: user._id }`, with a seven-day expiry.
`auth.middleware.js` attaches the decoded claims object to `req.user`; REST
controllers use `req.user.id`. There is no role system. Ownership is checked in
project update/delete and application-status update. Other authenticated
operations are not necessarily restricted to resource owners or collaborators.

Socket authentication is a separate path in `backend/index.js`; it currently
reads `decoded.Id` rather than the JWT's `id` claim. Fixing auth behavior should
keep HTTP and socket identity consistent and add server-side authorization for
room joins, message reads, and sends where project membership is required.

### Route/access nuance

The SPA marks project detail and project application as protected pages, but
the corresponding `GET /api/projects/:projectId` route itself is public.
Conversely, API access control is independent from whether a client page hides
a link or redirects a visitor. When adding a protected feature, enforce
authorization in the backend route/controller, not only in React.

## 11. UI state and error-handling conventions

- Pages generally load data in `useEffect`, store it in local component state,
  and show either skeleton/loading, empty, result, or error UI depending on the
  page.
- Service modules log errors and rethrow them; page components decide whether
  to display an error, log it, or set a user-facing message.
- Several pages only log fetch/mutation errors (`Homepage`, project creation,
  project detail loading, project application management, chat, profile, and
  conversation list), so failures may leave empty or stale-looking screens.
- `MyApplications` and profile completion show explicit user-facing failures;
  settings uses a transient success/error message.
- Settings notification/privacy controls are not sent to any service and are
  reset to their component defaults on remount.
- The project form marks title and required skills as required in HTML; domain
  and description are not marked required by the form even though the Mongoose
  schema requires them. The backend reports schema failures as 500 today.
- The chat screen loads history and joins the room during the same effect; it
  does not wait for a server acknowledgement that the room was joined before
  considering the socket ready.
- The profile screen fetches user and GitHub data together with `Promise.all`.
  If either request fails, both results are discarded by the shared catch.

## 12. Cross-layer change checklist

Use this as the normal workflow when revising a feature:

1. **Find the UI entry point.** Identify the route in `frontend/src/App.jsx`,
   then the page and any shared components it uses.
2. **Trace data in both directions.** Follow the page's service import to its
   Axios URL/body, then find the matching backend route, middleware, controller,
   and model. For realtime behavior, trace the client event and server event
   handlers separately from HTTP.
3. **Check the data contract.** Confirm field names, types/defaults, populated
   references, ownership identity, and response shape across form, service,
   controller, and schema.
4. **Preserve access control on the server.** Check public vs JWT routes and
   resource-level ownership/membership checks. A protected React route is not
   API authorization.
5. **Account for persisted and local state.** Decide whether a change affects
   MongoDB data, local/session storage, in-memory UI state, or all of them.
   Update relevant local user state after profile changes and clean dependent
   records intentionally.
6. **Update all linked surfaces.** For example, application status appears in
   the applicant list and owner review; project fields appear in the feed,
   detail, dashboard, and recommendation panel.
7. **Cover failure and empty states.** Consider unauthorized, missing records,
   duplicate submissions, invalid data, external GitHub errors, disconnected
   sockets, and empty result sets.
8. **Validate with repository tooling.** Run the focused frontend lint/build
   available in `frontend/package.json`; manually exercise the matching API and
   UI workflow. There are no backend test scripts in the current manifest, so
   API/Socket.IO behavior may require a running backend and MongoDB unless tests
   are added.
9. **Update this guide and README** when routes, environment variables, schemas,
   workflows, or deploy behavior change.

### Example: changing an application field

For a new application field, trace `Project.jsx` (submission UI) →
`application.services.js` (request body) → `application.routes.js` →
`application.controller.js` (creation/update/authorization) →
`Application.js` (schema) → `ProjectApplications.jsx` and `MyApplications.jsx`
(display). Decide whether the field also belongs in populate projections,
whether it should be editable, and whether any existing client local state must
be refreshed.

### Example: changing chat

Trace `Chat.jsx` and `message.services.js` for initial history, then
`backend/index.js` for socket authentication, room joining, persistence, and
broadcast. Check `Message.js` required fields and `message.controller.js` if
the HTTP message route also needs the same behavior. Review `/messages`
aggregation in `MyChats.jsx`, accepted-application navigation in
`MyApplications.jsx`, and server-side authorization for every read/join/send.

## 13. Known limitations to account for during revisions

These are observations of the current code, not desired behavior:

1. **Socket identity mismatch:** JWT claim is `id`, socket reads `Id`, causing
   socket-created messages to lack their required sender ID.
2. **Socket authorization is incomplete:** authenticated sockets can request
   arbitrary project rooms; join/send handlers do not verify project existence,
   membership, accepted application, or message content.
3. **Application list authorization is incomplete:** the endpoint requires a
   valid JWT but does not check the requester owns the project.
4. **Conversation grouping key:** `MyChats.jsx` uses populated `msg.projectId`
   objects as reduce keys instead of a stable project ID; this can group
   messages incorrectly.
5. **Account deletion leaves related records:** projects, applications, and
   messages referencing the deleted user remain.
6. **Project form/schema mismatch:** the UI does not require domain or
   description, but the schema does.
7. **Settings capabilities exceed persistence:** notification and privacy
   controls are visual/local only.
8. **OAuth redirect data in query string:** token and serialized user data are
   included in the frontend callback URL. Changes to callback handling should
   consider URL exposure and browser-history behavior.
9. **Several pages suppress actionable errors:** error paths often only log to
   the console rather than showing retry or failure states.
10. **Profile fetch coupling:** a GitHub API failure also prevents the
    successfully fetched app profile from being stored because requests are
    combined with `Promise.all`.

Before fixing a limitation, confirm the intended product behavior and apply a
focused change across every affected UI, API, persistence, and realtime surface.
