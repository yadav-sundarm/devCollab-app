import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signupService } from '../services/auth.services.js'
const Signup = () => {
    const [userData, setUserData] = useState({
        userName: '',
        email: '',
        password: '',
        githubLink: '',
        linkedinLink: '',
        portFolioLink: '',
        skills: '',
    })

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value })
    }
    const navigate = useNavigate()
    const onSubmit = async (e) => {
        e.preventDefault()
        try {
            await signupService({ ...userData, skills: userData.skills.split(',').map(skill => skill.trim()) })
            navigate('/')
        } catch (error) {
            console.error('Signup failed:', error);
        }
    }
    return (
        <div>
            <h2>Signup</h2>
            <form onSubmit={onSubmit}>
                <input type="text" name="userName" placeholder="Username" value={userData.userName} onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" value={userData.email} onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" value={userData.password} onChange={handleChange} required />
                <input type="text" name="githubLink" placeholder="GitHub Link" value={userData.githubLink} onChange={handleChange} required />
                <input type="text" name="linkedinLink" placeholder="LinkedIn Link" value={userData.linkedinLink} onChange={handleChange} />
                <input type="text" name="portFolioLink" placeholder="Portfolio Link" value={userData.portFolioLink} onChange={handleChange} />
                <input type="text" name="skills" placeholder="Skills (comma separated)" value={userData.skills} onChange={handleChange} required />
                <button type="submit">Signup</button>
            </form>
        </div>
    )
}

export default Signup;