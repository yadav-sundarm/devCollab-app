import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

const ProtectedRoutes = ({ children }) => {
    const navigate = useNavigate()
    const location = useLocation()
    const token = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user'))

    useEffect(() => {
        if (!token) {
            navigate('/login', {
                state: { from: location.pathname },
                replace: true
            })
            return
        }
        if (token && user && !user.isProfileComplete) {
            navigate('/complete-profile', { replace: true })
        }
    }, [token])

    return token ? children : null
}

export default ProtectedRoutes