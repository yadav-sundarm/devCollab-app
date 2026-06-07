import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProjects } from '../services/project.services.js'
import { ArrowRight } from 'lucide-react'

const RightPanel = () => {
    const [suggestedProjects, setSuggestedProjects] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const projects = await getProjects()
                setSuggestedProjects(projects.slice(0, 5))
            } catch (error) {
                console.error(error)
            }
        }
        fetchProjects()
    }, [])

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900 text-sm">Suggested Projects</h3>
            </div>
            <div className="divide-y divide-gray-100">
                {suggestedProjects.map(project => (
                    <div key={project._id} className="px-4 py-3 hover:bg-gray-50 transition">
                        <p className="text-sm font-medium text-gray-800 truncate">{project.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5 truncate">{project.domain}</p>
                        <button
                            onClick={() => navigate(`/projects/${project._id}`)}
                            className="mt-2 text-xs text-violet-600 hover:text-violet-700 font-medium flex items-center gap-1"
                        >
                            View project <ArrowRight className="w-3 h-3" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default RightPanel;