import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProjects } from '../services/project.services'

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
        <div>
            <h3>Suggested Projects</h3>
            {suggestedProjects.map(project => (
                <div key={project._id}>
                    <p>{project.title}</p>
                    <button onClick={() => navigate(`/projects/${project._id}`)}>
                        View
                    </button>
                </div>
            ))}
        </div>
    )
}

export default RightPanel