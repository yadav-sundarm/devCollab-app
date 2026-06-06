import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getProjects, searchProjects } from '../services/project.services'

const Homepage = () => {
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const query = searchParams.get('search')

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = query
                    ? await searchProjects(query)
                    : await getProjects()
                setProjects(data)
                setLoading(false)
            } catch (error) {
                console.error(error)
                setLoading(false)
            }
        }
        fetchProjects()
    }, [query])

    return (
        <div>
            <h1>Welcome to DevColab</h1>
            {loading ? (
                <p>Loading projects...</p>
            ) : projects.length === 0 ? (
                <p>No projects found!</p>
            ) : (
                projects.map(project => (
                    <div key={project._id}>
                        <h2>{project.title}</h2>
                        <p>{project.description}</p>
                        <p>{project.domain}</p>
                        <p>{project.requiredSkills?.join(', ')}</p>
                        <button onClick={() => navigate(`/projects/${project._id}`)}>
                            View Details
                        </button>
                    </div>
                ))
            )}
        </div>
    )
}

export default Homepage