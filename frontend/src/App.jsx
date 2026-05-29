import Homepage from './pages/Homepage.jsx';
import './App.css';
import Signup from './pages/Signup.jsx';
import Login from './pages/Login.jsx';
import Project from './pages/Project.jsx';
import ProtectedRoutes from './components/protectedRoutes.jsx';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        <Route path="/projects/:projectId" element={<ProtectedRoutes><Project /></ProtectedRoutes>} />
      </Routes>
    </Router>
  )
}

export default App;
