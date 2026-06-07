import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getProjects, searchProjects } from '../services/project.services.js';
import { Briefcase, Tag, ArrowRight } from 'lucide-react';

const Homepage = () => {
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const query = searchParams.get('search')

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = query ? await searchProjects(query) : await getProjects()
                setProjects(data)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        fetchProjects()
    }, [query])

    if (loading) return (
        <div className="space-y-3">
            {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
                    <div className="h-3 bg-gray-200 rounded w-full mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>
            ))}
        </div>
    )

    return (
        <div className="space-y-3">
            {query && (
                <p className="text-sm text-gray-500 px-1">
                    Results for <span className="font-medium text-gray-800">"{query}"</span>
                </p>
            )}
            {projects.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
                    <p className="text-gray-500 text-sm">No projects found.</p>
                </div>
            ) : (
                projects.map(project => (
                    <div key={project._id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <h2 className="font-semibold text-gray-900 text-base">{project.title}</h2>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                                    <span className="text-xs text-gray-500">{project.domain}</span>
                                </div>
                                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{project.description}</p>
                                <div className="flex flex-wrap gap-1.5 mt-3">
                                    {project.requiredSkills?.map(skill => (
                                        <span key={skill} className="inline-flex items-center gap-1 px-2 py-0.5 bg-violet-50 text-violet-700 text-xs rounded-full border border-violet-100">
                                            <Tag className="w-3 h-3" />{skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <span className={`shrink-0 text-xs px-2.5 py-1 rounded-full font-medium ${project.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                }`}>
                                {project.status}
                            </span>
                        </div>
                        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                            <button
                                onClick={() => navigate(`/projects/${project._id}`)}
                                className="flex items-center gap-1.5 text-sm font-medium text-violet-600 hover:text-violet-700 transition"
                            >
                                View details <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}

export default Homepage;