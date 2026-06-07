import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProjectsByOwner } from '../services/project.services.js';
import { Plus, Users, FolderOpen } from 'lucide-react';

const Dashboard = () => {
    const user = JSON.parse(localStorage.getItem('user'))
    const [myProjects, setMyProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await getProjectsByOwner()
                setMyProjects(response.map(p => ({ ...p, applicationsCount: p.applications.length })))
            } catch (error) {
                console.error('Error fetching project:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchProject()
    }, [])

    return (
        <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-gray-900">Welcome, {user?.userName}</h1>
                    <p className="text-sm text-gray-500 mt-0.5">{user?.email}</p>
                </div>
                <button
                    onClick={() => navigate('/projects/createProject')}
                    className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                >
                    <Plus className="w-4 h-4" /> New Project
                </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {[
                    { icon: <FolderOpen className="w-5 h-5 text-violet-600" />, value: myProjects.length, label: 'Total Projects' },
                    { icon: <Users className="w-5 h-5 text-violet-600" />, value: myProjects.reduce((s, p) => s + p.applicationsCount, 0), label: 'Total Applications' },
                ].map(stat => (
                    <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
                        <div className="w-9 h-9 bg-violet-100 rounded-lg flex items-center justify-center shrink-0">{stat.icon}</div>
                        <div>
                            <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                            <p className="text-xs text-gray-500">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-xl border border-gray-200">
                <div className="px-5 py-3 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-900 text-sm">My Projects</h2>
                </div>
                {loading ? (
                    <div className="p-5 space-y-3">
                        {[1, 2].map(i => <div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse" />)}
                    </div>
                ) : myProjects.length === 0 ? (
                    <div className="p-10 text-center">
                        <FolderOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm">No projects yet.</p>
                        <button onClick={() => navigate('/projects/createProject')} className="mt-3 text-violet-600 text-sm hover:underline">
                            Create your first project
                        </button>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {myProjects.map(project => (
                            <div key={project._id} className="px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition">
                                <div>
                                    <h3 className="font-medium text-gray-900 text-sm">{project.title}</h3>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <Users className="w-3.5 h-3.5 text-gray-400" />
                                        <span className="text-xs text-gray-500">{project.applicationsCount} application{project.applicationsCount !== 1 ? 's' : ''}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => navigate(`/myProjects/${project._id}`)}
                                    className="text-sm text-violet-600 border border-violet-200 hover:border-violet-400 px-3 py-1.5 rounded-lg transition"
                                >
                                    View
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Dashboard;