import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signupService } from '../services/auth.services.js';

const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"

const Signup = () => {
    const [userData, setUserData] = useState({
        userName: '', email: '', password: '',
        githubLink: '', linkedinLink: '', portFolioLink: '', skills: '',
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleChange = (e) => setUserData({ ...userData, [e.target.name]: e.target.value })

    const onSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            await signupService({ ...userData, skills: userData.skills.split(',').map(s => s.trim()) })
            navigate('/')
        } catch (error) {
            setError(error.response?.data?.message || 'Signup failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-violet-600">DevColab</h1>
                    <p className="text-gray-500 text-sm mt-1">Join the developer community</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Create account</h2>
                    {error && (
                        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">{error}</div>
                    )}
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                <input type="text" name="userName" placeholder="johndoe" value={userData.userName} onChange={handleChange} required className={inputClass} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input type="email" name="email" placeholder="you@example.com" value={userData.email} onChange={handleChange} required className={inputClass} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input type="password" name="password" placeholder="••••••••" value={userData.password} onChange={handleChange} required className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">GitHub URL <span className="text-red-400">*</span></label>
                            <input type="text" name="githubLink" placeholder="https://github.com/username" value={userData.githubLink} onChange={handleChange} required className={inputClass} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                                <input type="text" name="linkedinLink" placeholder="linkedin.com/in/..." value={userData.linkedinLink} onChange={handleChange} className={inputClass} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Portfolio</label>
                                <input type="text" name="portFolioLink" placeholder="yoursite.com" value={userData.portFolioLink} onChange={handleChange} className={inputClass} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Skills <span className="text-red-400">*</span></label>
                            <input type="text" name="skills" placeholder="React, Node.js, MongoDB" value={userData.skills} onChange={handleChange} required className={inputClass} />
                            <p className="text-xs text-gray-400 mt-1">Comma separated</p>
                        </div>
                        <button type="submit" disabled={loading}
                            className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white py-2.5 rounded-lg text-sm font-medium transition">
                            {loading ? 'Creating account...' : 'Create account'}
                        </button>
                    </form>
                    <p className="text-center text-sm text-gray-500 mt-6">
                        Already have an account?{' '}
                        <button onClick={() => navigate('/login')} className="text-violet-600 hover:underline font-medium">Sign in</button>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Signup;