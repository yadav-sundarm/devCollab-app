import { useEffect, useState } from 'react';
import { getApplicationsByProject, updateApplicationStatus } from '../services/application.services.js';
import { useParams } from 'react-router-dom';
import { Mail, Tag, CheckCircle, XCircle } from 'lucide-react';

const statusStyles = {
    Pending: 'bg-yellow-100 text-yellow-700',
    Accepted: 'bg-green-100 text-green-700',
    Rejected: 'bg-red-100 text-red-700',
}

const ProjectApplications = () => {
    const [applications, setApplications] = useState([])
    const { projectId } = useParams()

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await getApplicationsByProject(projectId)
                setApplications(response)
            } catch (error) {
                console.log('Error fetching applications: ', error)
            }
        }
        fetchApplications()
    }, [projectId])

    const handleStatus = async (applicationId, status) => {
        try {
            await updateApplicationStatus(projectId, applicationId, status)
            setApplications(applications.map(app =>
                app._id === applicationId ? { ...app, status } : app
            ))
        } catch (error) {
            console.log('Error: ', error)
        }
    }

    return (
        <div className="space-y-3">
            <div className="bg-white rounded-xl border border-gray-200 px-5 py-4">
                <h1 className="font-semibold text-gray-900">Project Applications</h1>
                <p className="text-xs text-gray-500 mt-0.5">{applications.length} applicant{applications.length !== 1 ? 's' : ''}</p>
            </div>

            {applications.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
                    <p className="text-gray-500 text-sm">No applications yet.</p>
                </div>
            ) : (
                applications.map(application => (
                    <div key={application._id} className="bg-white rounded-xl border border-gray-200 p-5">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
                                    <span className="text-sm font-semibold text-violet-700">
                                        {application.applicantId.userName.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 text-sm">{application.applicantId.userName}</p>
                                    <div className="flex items-center gap-1 mt-0.5">
                                        <Mail className="w-3 h-3 text-gray-400" />
                                        <span className="text-xs text-gray-500">{application.applicantId.email}</span>
                                    </div>
                                </div>
                            </div>
                            <span className={`shrink-0 text-xs px-2.5 py-1 rounded-full font-medium ${statusStyles[application.status] || 'bg-gray-100 text-gray-600'}`}>
                                {application.status}
                            </span>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-1.5">
                            {application.applicantId.skills?.map(skill => (
                                <span key={skill} className="inline-flex items-center gap-1 px-2 py-0.5 bg-violet-50 text-violet-700 text-xs rounded-full border border-violet-100">
                                    <Tag className="w-3 h-3" />{skill}
                                </span>
                            ))}
                        </div>

                        {application.message && (
                            <p className="text-sm text-gray-600 mt-3 bg-gray-50 rounded-lg px-3 py-2 italic">"{application.message}"</p>
                        )}

                        {application.status === 'Pending' && (
                            <div className="mt-4 pt-3 border-t border-gray-100 flex gap-2">
                                <button onClick={() => handleStatus(application._id, 'Accepted')}
                                    className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition">
                                    <CheckCircle className="w-3.5 h-3.5" /> Accept
                                </button>
                                <button onClick={() => handleStatus(application._id, 'Rejected')}
                                    className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-medium px-3 py-1.5 rounded-lg transition">
                                    <XCircle className="w-3.5 h-3.5" /> Reject
                                </button>
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    )
}

export default ProjectApplications;