import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProjectsByOwner } from "../services/project.services.js";


const Dashboard = () => {
    const user = JSON.parse(localStorage.getItem('user'));

    const [myProjects, setMyProjects] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await getProjectsByOwner();
                const myProject = response.map(project => ({
                    ...project,
                    applicationsCount: project.applications.length
                }))
                setMyProjects(myProject);
            } catch (error) {
                console.error("Error fetching project:", error);
            }
        }
        fetchProject();
    }, []);

    return (
        <div>
            {/* User info section */}
            <h1>Welcome, {user?.userName}</h1>
            <p>{user?.email}</p>

            {/* Projects section */}
            <h2>My Projects</h2>
            {myProjects.length === 0 ? (
                <p>You have no projects yet. <button onClick={() => navigate('/projects/createProject')}>Create one</button></p>
            ) : (myProjects.map((project) => (
                <div key={project._id}>
                    <h2>{project.title}</h2>
                    <p>{project.applicationsCount}</p>
                    <button onClick={() => navigate(`/myProjects/${project._id}`)}>View Details</button>
                </div>
            )))}
        </div>
    )
}

export default Dashboard;