import { useEffect } from 'react'
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import { Github } from 'lucide-react'

const Login = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [searchParams] = useSearchParams()
    const error = searchParams.get('error')

    const from = location.state?.from || '/'

    useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate(from, { replace: true })
        }
    }, [])

    const handleGithubLogin = () => {
        sessionStorage.setItem('redirectAfterLogin', from)
        window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/github`
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-violet-600">DevColab</h1>
                    <p className="text-gray-500 text-sm mt-1">Find developers to build with</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2 text-center">Welcome!</h2>
                    <p className="text-sm text-gray-500 text-center mb-6">
                        Sign in or create an account using GitHub
                    </p>
                    {error === 'github_failed' && (
                        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                            GitHub login failed. Please try again.
                        </div>
                    )}
                    <button
                        onClick={handleGithubLogin}
                        className="w-full flex items-center justify-center gap-3 bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-lg text-sm font-medium transition"
                    >
                        <Github className="w-5 h-5" />
                        Continue with GitHub
                    </button>
                    <p className="text-center text-xs text-gray-400 mt-6">
                        By continuing, you agree to our Terms of Service
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login;