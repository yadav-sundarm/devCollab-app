import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const ProtectedRoutes = ({ children }) => {
    const navigate = useNavigate()
    const token = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user'))

    useEffect(() => {
        if (!token) {
            navigate('/login')
            return
        }
        // If logged in but profile not complete
        // redirect to complete profile except if already there
        if (token && user && !user.isProfileComplete) {
            navigate('/complete-profile')
        }
    }, [token])

    return token ? children : null
}

export default ProtectedRoutes