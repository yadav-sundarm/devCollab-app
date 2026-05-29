import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getProjectById } from "../services/project.services.js"
import { applyToProject } from "../services/application.services.js";

const Project = () => {
    const [project, setProject] = useState({
        title: "",
        description: "",
        requiredSkills: [],
        status: "",
    });
    const { projectId } = useParams();
    const [showApplyForm, setShowApplyForm] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchProject = async (projectId) => {
            try {
                const response = await getProjectById(projectId);
                setProject(response);
            } catch (error) {
                console.error("Error fetching project:", error);
            }
        }
        fetchProject(projectId);
    }, [projectId]);

    const handleApply = async () => {
        try {
            const response = await applyToProject(projectId, { message });
            alert("Application submitted successfully!");
            console.log(response)
            setShowApplyForm(false);
        } catch (error) {
            if (error.response?.status === 400) {
                alert("You have already applied to this project.")
            } else {
                alert("Something went wrong. Please try again.")
            }
            console.error("Error submitting application:", error);
        }
    }

    return (
        <div>
            <h1>{project.title}</h1>
            <p>{project.description}</p>
            <p>Skills Required: {project.requiredSkills?.join(", ")}</p>
            <p>Status: {project.status}</p>
            <button onClick={() => setShowApplyForm(!showApplyForm)}>Apply Now</button>

            {showApplyForm && (
                <div>
                    <textarea
                        placeholder="Why do you want to join this project?"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <button onClick={handleApply}>Submit Application</button>
                </div>
            )}
        </div>
    );
}

export default Project;