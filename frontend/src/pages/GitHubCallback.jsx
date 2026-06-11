import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const GitHubCallback = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    useEffect(() => {
        const token = searchParams.get('token')
        const userData = searchParams.get('user')

        if (!token || !userData) {
            navigate('/login?error=github_failed')
            return
        }

        try {
            // Save token and user to localStorage
            const user = JSON.parse(decodeURIComponent(userData))
            localStorage.setItem('token', token)
            localStorage.setItem('user', JSON.stringify(user))

            // Check if profile is complete
            if (!user.isProfileComplete) {
                navigate('/complete-profile')
            } else {
                navigate('/')
            }
        } catch (error) {
            console.error('Callback error:', error)
            navigate('/login?error=github_failed')
        }
    }, [])

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="text-center">
                <div className="w-10 h-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-500 text-sm">Signing you in...</p>
            </div>
        </div>
    )
}

export default GitHubCallback;