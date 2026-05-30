import { useEffect, useState } from "react";
import { getApplicationsByProject, updateApplicationStatus } from "../services/application.services.js";
import { useParams } from "react-router-dom";
const ProjectApplications = () => {
    const [applications, setApplications] = useState([]);
    const { projectId } = useParams();
    useEffect(() => {
        const fetchApplications = async (projectId) => {
            try {
                const response = await getApplicationsByProject(projectId);
                setApplications(response);
            } catch (error) {
                console.log('Error fetching applications : ', error)
            }
        }
        fetchApplications(projectId);
    }, [projectId])

    const onClick = async (applicationId, status) => {
        try {
            await updateApplicationStatus(projectId, applicationId, status)
            setApplications(applications.map(app =>
                app._id === applicationId ? { ...app, status } : app
            ))
        } catch (error) {
            console.log('Error, please try again : ', error)
        }
    }
    return (
        <div>
            {applications.map((application) => (
                <div key={application._id}>
                    <p>Applicant Name : {application.applicantId.userName}</p>
                    <p>Applicant E-mail id : {application.applicantId.email}</p>
                    <p>Applicant Skills : {application.applicantId.skills.join(", ")}</p>
                    <p>Message by applicant : {application.message}</p>
                    <p>Current Status :{application.status}</p>
                    <button onClick={() => onClick(application._id, "Accepted")}>Accept</button>
                    <button onClick={() => onClick(application._id, "Rejected")}>Reject</button>
                </div>
            ))}
        </div>
    )
}

export default ProjectApplications;