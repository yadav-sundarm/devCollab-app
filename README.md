# DevColab

A developer collaboration platform where developers can post projects, find collaborators, apply to join open projects, and communicate in real-time. Built with the MERN stack and Socket.io.

## Features

- **Authentication** — JWT-based signup and login
- **Project Feed** — Browse, search, and filter open projects by title, skill, or domain
- **Apply to Projects** — Send applications with a cover message; track status (Pending / Accepted / Rejected)
- **Project Dashboard** — Manage your own projects and review incoming applications
- **Real-time Chat** — Socket.io powered group chat per project, unlocked after acceptance
- **GitHub Integration** — Auto-fetches GitHub profile, repositories, top languages, and stats on the profile page
- **Skill-based Suggestions** — Right panel recommends projects that match your skill set

## Tech Stack

**Frontend**
- React 19 + Vite
- Tailwind CSS v4
- React Router v7
- Socket.io Client
- Lucide React

**Backend**
- Express 5
- MongoDB + Mongoose
- Socket.io
- JSON Web Tokens (JWT)
- bcryptjs
- GitHub REST API

## Project Structure

```
devCollab-app/
├── frontend/
│   ├── src/
│   │   ├── components/     # Navbar, Sidebar, RightPanel, Layout
│   │   ├── pages/          # Homepage, Dashboard, Chat, Profile, etc.
│   │   ├── services/       # Axios API calls per feature
│   │   └── main.jsx
│   └── vite.config.js
└── backend/
    ├── controllers/        # Auth, Project, Application, Message, GitHub, User
    ├── models/             # Mongoose schemas
    ├── routes/             # Express routers
    ├── middlewares/        # JWT auth middleware
    ├── utils/              # GitHub API helper
    └── index.js
```

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- GitHub Personal Access Token (for GitHub integration)

### Clone the repo

```bash
git clone https://github.com/your-username/devCollab-app.git
cd devCollab-app
```

### Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GITHUB_API=your_github_personal_access_token
```

Start the backend:

```bash
npm run dev
```

### Frontend setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` folder:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

### Run both together (from root)

```bash
npm run dev
```

## Environment Variables

| Variable | Location | Description |
|---|---|---|
| `PORT` | backend | Server port (default 5000) |
| `MONGO_URI` | backend | MongoDB connection string |
| `JWT_SECRET` | backend | Secret key for JWT signing |
| `GITHUB_API` | backend | GitHub personal access token |
| `VITE_API_URL` | frontend | Backend base URL |

## API Routes

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/signup` | Register a new user | No |
| POST | `/api/auth/login` | Login and get token | No |
| GET | `/api/projects` | Get all projects | No |
| POST | `/api/projects` | Create a project | Yes |
| GET | `/api/projects/:id` | Get project by ID | No |
| GET | `/api/projects/myProjects` | Get logged-in user's projects | Yes |
| GET | `/api/projects/search` | Search projects | No |
| POST | `/api/projects/:id/apply` | Apply to a project | Yes |
| GET | `/api/projects/:id/applications` | Get applications for a project | Yes |
| PATCH | `/api/projects/:id/applications/:appId` | Accept or reject an application | Yes |
| GET | `/api/myApplications` | Get logged-in user's applications | Yes |
| GET | `/api/messages/:projectId` | Get messages for a project | Yes |
| GET | `/api/messages/user` | Get all conversations for a user | Yes |
| GET | `/api/github/:userId` | Get GitHub data for a user | Yes |
| GET | `/api/users/:userId` | Get user profile by ID | Yes |

## Live Demo

Link : https://dev-collab-app-zeta.vercel.app/

## Screenshots

*Homepage :*
<img width="1602" height="792" alt="image" src="https://github.com/user-attachments/assets/b0f5af6d-5f01-4ba8-b1ed-93074bbf35b5" />

*Create A project :*
<img width="1596" height="833" alt="image" src="https://github.com/user-attachments/assets/9c3719bd-751d-4d85-bac1-3afb88845275" />

*User Dashboard :*
<img width="1612" height="802" alt="image" src="https://github.com/user-attachments/assets/8146c97a-091e-4b31-9605-e91c9f7e3c48" />

*User Profile with Github info :*
<img width="1622" height="880" alt="image" src="https://github.com/user-attachments/assets/7fe3b884-21ee-4a9b-a520-43dd05913f92" />

## License

MIT
