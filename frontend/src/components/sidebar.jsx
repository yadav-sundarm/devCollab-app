import { useNavigate } from 'react-router-dom'

const Sidebar = () => {
    const navigate = useNavigate()

    return (
        <div>
            <ul>
                <li onClick={() => navigate('/')}>Home</li>
                <li onClick={() => navigate('/projects/createProject')}>Post</li>
                <li onClick={() => navigate('/applications')}>My Applications</li>
                <li onClick={() => navigate('/dashboard')}>Dashboard</li>
                <li onClick={() => navigate(`/profile/${JSON.parse(localStorage.getItem('user'))?._id}`)}>Profile</li>
                {localStorage.getItem('token') ? (
                    <li onClick={() => {
                        localStorage.removeItem('user')
                        localStorage.removeItem('token')
                        navigate('/')
                    }}>Logout</li>
                ) : (
                    <>
                        <li onClick={() => navigate('/login')}>Login</li>
                        <li onClick={() => navigate('/signup')}>Signup</li>
                    </>
                )}
            </ul>
        </div>
    )
}

export default Sidebar