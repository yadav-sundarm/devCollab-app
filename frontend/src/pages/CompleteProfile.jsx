import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { completeUserProfile } from '../services/user.services.js'

const CompleteProfile = () => {
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem('user'))
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const [formData, setFormData] = useState({
        skills: '',
        linkedinLink: '',
        portFolioLink: '',
    })

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        if (!formData.skills.trim()) {
            return setError('Please add at least one skill')
        }
        setLoading(true)
        setError('')
        try {
            const updated = await completeUserProfile({
                skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
                linkedinLink: formData.linkedinLink,
                portFolioLink: formData.portFolioLink,
            })
            localStorage.setItem('user', JSON.stringify(updated))
            navigate('/')
        } catch (error) {
            console.log("Complete profile error:", error)
            setError('Failed to save profile. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-violet-600">DevColab</h1>
                    <p className="text-gray-500 text-sm mt-1">Almost there!</p>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-8">
                    {/* User preview */}
                    <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
                        <img
                            src={user?.avatar}
                            alt="avatar"
                            className="w-12 h-12 rounded-full border border-gray-200"
                        />
                        <div>
                            <p className="font-medium text-gray-900 text-sm">{user?.userName}</p>
                            <p className="text-xs text-gray-500">{user?.email}</p>
                        </div>
                    </div>

                    <h2 className="text-lg font-semibold text-gray-900 mb-1">Complete your profile</h2>
                    <p className="text-sm text-gray-500 mb-6">
                        Add your skills so other developers can find you
                    </p>

                    {error && (
                        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                            {error}
                        </div>
                    )}

                    <form onSubmit={onSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Skills <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                name="skills"
                                value={formData.skills}
                                onChange={handleChange}
                                placeholder="React, Node.js, MongoDB..."
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                            />
                            <p className="text-xs text-gray-400 mt-1">Comma separated</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                LinkedIn <span className="text-gray-400 font-normal">(optional)</span>
                            </label>
                            <input
                                type="text"
                                name="linkedinLink"
                                value={formData.linkedinLink}
                                onChange={handleChange}
                                placeholder="https://linkedin.com/in/username"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Portfolio <span className="text-gray-400 font-normal">(optional)</span>
                            </label>
                            <input
                                type="text"
                                name="portFolioLink"
                                value={formData.portFolioLink}
                                onChange={handleChange}
                                placeholder="https://yoursite.com"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white py-2.5 rounded-lg text-sm font-medium transition"
                        >
                            {loading ? 'Saving...' : 'Complete Profile'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CompleteProfile;