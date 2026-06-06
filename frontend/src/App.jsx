import Homepage from './pages/Homepage.jsx'
import './App.css'
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'
import Project from './pages/Project.jsx'
import CreateProject from './pages/CreateProject.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ProjectApplications from './pages/ProjectApplications.jsx'
import UserProfile from './pages/UserProfilePage.jsx'
import Layout from './components/layout.jsx'
import ProtectedRoutes from './components/protectedRoutes.jsx'
import MyApplications from './pages/MyApplications.jsx'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
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
      </Routes>
    </Router>
  )
}

export default App