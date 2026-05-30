import Homepage from './pages/Homepage.jsx';
import './App.css';
import Signup from './pages/Signup.jsx';
import Login from './pages/Login.jsx';
import Project from './pages/Project.jsx';
import CreateProject from './pages/CreateProject.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ProjectApplications from './pages/ProjectApplications.jsx';
import ProtectedRoutes from './components/protectedRoutes.jsx';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/projects/createProject" element={<ProtectedRoutes><CreateProject /></ProtectedRoutes>} />
        <Route path="/dashboard" element={<ProtectedRoutes><Dashboard /></ProtectedRoutes>} />
        <Route path="/myProjects/:projectId" element={<ProtectedRoutes><ProjectApplications /></ProtectedRoutes>} />
        <Route path="/projects/:projectId" element={<ProtectedRoutes><Project /></ProtectedRoutes>} />
      </Routes>
    </Router>
  )
}

export default App;
