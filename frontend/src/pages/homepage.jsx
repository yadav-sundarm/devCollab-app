import { useState, useEffect } from "react";
import { getProjects } from "../services/project.services.js";
import { useNavigate } from "react-router-dom";
const Homepage = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const projectsData = await getProjects();
                setProjects(projectsData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching projects:", error);
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const navigate = useNavigate();

    return (
        <div>
            <h1>Welcome to the Homepage</h1>
            {loading ? (
                <p>Loading projects...</p>
            ) : (
                projects.map((project) => (
                    <div key={project._id}>
                        <h2>{project.title}</h2>
                        <p>{project.description}</p>
                        <button onClick={() => navigate(`/projects/${project._id}`)}>View Details</button>
                    </div>
                ))
            )}
        </div >
    );
};
export default Homepage;