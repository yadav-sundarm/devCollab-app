import Homepage from './pages/Homepage.jsx'
import './App.css'
import Login from './pages/Login.jsx'
import Project from './pages/Project.jsx'
import CreateProject from './pages/CreateProject.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ProjectApplications from './pages/ProjectApplications.jsx'
import UserProfile from './pages/UserProfilePage.jsx'
import Layout from './components/Layout.jsx'
import ProtectedRoutes from './components/ProtectedRoutes.jsx'
import MyApplications from './pages/MyApplications.jsx'
import Chat from './pages/Chat.jsx'
import GitHubCallback from './pages/GitHubCallback.jsx'
import CompleteProfile from './pages/CompleteProfile.jsx'
import MyChats from './pages/MyChats.jsx'
import Settings from './pages/Settings.jsx'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/auth/callback" element={<GitHubCallback />} />
        <Route path="/complete-profile" element={<ProtectedRoutes><Layout><CompleteProfile /></Layout></ProtectedRoutes>} />
        <Route path="/settings" element={
          <ProtectedRoutes>
            <Layout><Settings /></Layout>
          </ProtectedRoutes>
        } />
        <Route path="/" element={<Layout><Homepage /></Layout>} />
        <Route path="/projects/createProject" element={
          <ProtectedRoutes>
            <Layout><CreateProject /></Layout>
          </ProtectedRoutes>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoutes>
            <Layout><Dashboard /></Layout>
          </ProtectedRoutes>
        } />
        <Route path="/applications" element={
          <ProtectedRoutes>
            <Layout><MyApplications /></Layout>
          </ProtectedRoutes>
        } />
        <Route path="/myProjects/:projectId" element={
          <ProtectedRoutes>
            <Layout><ProjectApplications /></Layout>
          </ProtectedRoutes>
        } />
        <Route path="/projects/:projectId" element={
          <ProtectedRoutes>
            <Layout><Project /></Layout>
          </ProtectedRoutes>
        } />
        <Route path="/profile/:userId" element={
          <ProtectedRoutes>
            <Layout><UserProfile /></Layout>
          </ProtectedRoutes>
        } />
        <Route path="/chat/:projectId" element={
          <ProtectedRoutes>
            <Layout><Chat /></Layout>
          </ProtectedRoutes>
        } />
        <Route path="/messages" element={
          <ProtectedRoutes>
            <Layout><MyChats /></Layout>
          </ProtectedRoutes>
        } />
      </Routes>
    </Router>
  )
}

export default App;