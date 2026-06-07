import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginService } from '../services/auth.services.js';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const [userData, setUserData] = useState({ email: '', password: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()

    const handleChange = (e) => setUserData({ ...userData, [e.target.name]: e.target.value })

    const onSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            await loginService(userData)
            navigate('/')
        } catch {
            setError('Invalid email or password. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-violet-600">DevColab</h1>
                    <p className="text-gray-500 text-sm mt-1">Find developers to build with</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Sign in</h2>
                    {error && (
                        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                            {error}
                        </div>
                    )}
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="you@example.com"
                                value={userData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                            />
                        </div>

                        {/* Password with eye toggle */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    placeholder="••••••••"
                                    value={userData.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white py-2.5 rounded-lg text-sm font-medium transition"
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </form>
                    <p className="text-center text-sm text-gray-500 mt-6">
                        Don't have an account?{' '}
                        <button onClick={() => navigate('/signup')} className="text-violet-600 hover:underline font-medium">
                            Sign up
                        </button>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login;