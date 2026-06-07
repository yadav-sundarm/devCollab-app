import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyApplications } from '../services/application.services.js';
import { MessageSquare, ExternalLink, Clock } from 'lucide-react';

const statusStyles = {
    Pending: 'bg-yellow-100 text-yellow-700',
    Accepted: 'bg-green-100 text-green-700',
    Rejected: 'bg-red-100 text-red-700',
}

const MyApplications = () => {
    const [applications, setApplications] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const data = await getMyApplications()
                setApplications(data)
            } catch {
                setError('Failed to load applications. Please try again.')
            } finally {
                setLoading(false)
            }
        }
        fetchApplications()
    }, [])

    if (loading) return (
        <div className="space-y-3">
            {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
                    <div className="h-3 bg-gray-200 rounded w-full" />
                </div>
            ))}
        </div>
    )

    if (error) return (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <p className="text-red-500 text-sm">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-3 text-violet-600 text-sm hover:underline">Retry</button>
        </div>
    )

    return (
        <div className="space-y-3">
            <div className="bg-white rounded-xl border border-gray-200 px-5 py-4">
                <h1 className="font-semibold text-gray-900">My Applications</h1>
                <p className="text-xs text-gray-500 mt-0.5">{applications.length} application{applications.length !== 1 ? 's' : ''}</p>
            </div>

            {applications.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
                    <p className="text-gray-500 text-sm">You haven't applied to any projects yet.</p>
                    <button onClick={() => navigate('/')} className="mt-3 text-violet-600 text-sm hover:underline">Browse Projects</button>
                </div>
            ) : (
                applications.map(application => (
                    <div key={application._id} className="bg-white rounded-xl border border-gray-200 p-5">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                                <h2 className="font-semibold text-gray-900 truncate">{application.projectId?.title}</h2>
                                <p className="text-xs text-gray-500 mt-0.5">{application.projectId?.domain}</p>
                            </div>
                            <span className={`shrink-0 text-xs px-2.5 py-1 rounded-full font-medium ${statusStyles[application.status] || 'bg-gray-100 text-gray-600'}`}>
                                {application.status}
                            </span>
                        </div>
                        {application.message && (
                            <p className="text-sm text-gray-600 mt-3 bg-gray-50 rounded-lg px-3 py-2 italic">"{application.message}"</p>
                        )}
                        <div className="flex items-center gap-1.5 mt-3">
                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-xs text-gray-400">Applied {new Date(application.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2">
                            {application.status === 'Accepted' && (
                                <button onClick={() => navigate(`/chat/${application.projectId?._id}`)}
                                    className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition">
                                    <MessageSquare className="w-3.5 h-3.5" /> Chat Now
                                </button>
                            )}
                            <button onClick={() => navigate(`/projects/${application.projectId?._id}`)}
                                className="flex items-center gap-1.5 text-xs text-gray-600 border border-gray-300 hover:border-gray-400 px-3 py-1.5 rounded-lg transition">
                                <ExternalLink className="w-3.5 h-3.5" /> View Project
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}

export default MyApplications;