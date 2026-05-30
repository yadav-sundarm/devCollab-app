import { useState } from 'react';
import { createProject } from "../services/project.services.js"
import { useNavigate } from 'react-router-dom';
const CreateProject = () => {
    const [projectData, setProjectData] = useState({
        title: '',
        description: '',
        requiredSkills: '',
        domain: '',
    })

    const handleChange = (e) => {
        setProjectData({ ...projectData, [e.target.name]: e.target.value });
    }

    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault()
        try {
            const requiredSkills = projectData.requiredSkills.split(",").map(skill => skill.trim());
            const response = await createProject({ ...projectData, requiredSkills });
            if (response) {
                navigate('/')
            }
            console.log(response);
        } catch (error) {
            console.log("An error occured : ", error)
        }
    }
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input type="text" name="title" placeholder="Title" value={projectData.title} onChange={handleChange} required />
                <input type="text" name="description" placeholder="Description" value={projectData.description} onChange={handleChange} />
                <input type="text" name="domain" placeholder="Domain" value={projectData.domain} onChange={handleChange} />
                <input type="text" name="requiredSkills" placeholder="Required Skills (comma separated)" value={projectData.requiredSkills} onChange={handleChange} required />
                <button type="submit">Create Project</button>
            </form>
        </div>
    )
}

export default CreateProject;