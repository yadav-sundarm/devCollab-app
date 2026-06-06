import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyApplications } from "../services/application.services";

const MyApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const data = await getMyApplications();
                setApplications(data);
            } catch (error) {
                console.error("Error fetching applications:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, []);

    if (loading) return <p>Loading applications...</p>

    return (
        <div>
            <h1>My Applications</h1>
            {applications.length === 0 ? (
                <p>You haven't applied to any projects yet. <button onClick={() => navigate('/')}>Browse Projects</button></p>
            ) : (
                applications.map(application => (
                    <div key={application._id}>
                        {/* Project Info */}
                        <h2>{application.projectId?.title}</h2>
                        <p>Domain: {application.projectId?.domain}</p>
                        <p>Project Status: {application.projectId?.status}</p>

                        {/* Application Info */}
                        <p>Message: {application.message}</p>
                        <p>Applied: {new Date(application.createdAt).toLocaleDateString()}</p>

                        {/* Application Status */}
                        <p>Status: {application.status}</p>

                        {/* Actions based on status */}
                        {application.status === "Accepted" && (
                            <button onClick={() => navigate(`/messages/${application.projectId?._id}`)}>
                                Chat Now
                            </button>
                        )}
                        <button onClick={() => navigate(`/projects/${application.projectId?._id}`)}>
                            View Project
                        </button>
                    </div>
                ))
            )}
        </div>
    )
}

export default MyApplications;