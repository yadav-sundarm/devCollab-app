import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Lock, Bell, Trash2, Save, ChevronRight, Shield } from 'lucide-react'
import { updateUser, changePassword, deleteUser } from '../services/user.services'

const Settings = () => {
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem('user'))
    const [activeTab, setActiveTab] = useState('profile')
    const [message, setMessage] = useState({ text: '', type: '' })

    const [profileForm, setProfileForm] = useState({
        userName: user?.userName || '',
        email: user?.email || '',
        githubLink: user?.githubLink || '',
        linkedinLink: user?.linkedinLink || '',
        portFolioLink: user?.portFolioLink || '',
        skills: user?.skills?.join(', ') || '',
    })

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    })

    const [notifications, setNotifications] = useState({
        applicationUpdates: true,
        newMessages: true,
        projectInvites: true,
        emailNotifications: false,
    })

    const tabs = [
        { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
        { id: 'password', label: 'Password', icon: <Lock className="w-4 h-4" /> },
        { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
        { id: 'privacy', label: 'Privacy', icon: <Shield className="w-4 h-4" /> },
        { id: 'danger', label: 'Danger Zone', icon: <Trash2 className="w-4 h-4" /> },
    ]

    const showMessage = (text, type) => {
        setMessage({ text, type })
        setTimeout(() => setMessage({ text: '', type: '' }), 3000)
    }

    const handleProfileChange = (e) => {
        setProfileForm({ ...profileForm, [e.target.name]: e.target.value })
    }

    const handlePasswordChange = (e) => {
        setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value })
    }

    const handleToggle = (key) => {
        setNotifications({ ...notifications, [key]: !notifications[key] })
    }

    const handleProfileSave = async () => {
        try {
            const skills = profileForm.skills.split(',').map(s => s.trim())
            const updated = await updateUser({ ...profileForm, skills })
            localStorage.setItem('user', JSON.stringify(updated))
            showMessage('Profile updated successfully!', 'success')
        } catch (error) {
            showMessage('Failed to update profile', error.response?.data?.message || 'error')
        }
    }

    const handlePasswordSave = async () => {
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            return showMessage('New passwords do not match!', 'error')
        }
        if (passwordForm.newPassword.length < 6) {
            return showMessage('Password must be at least 6 characters!', 'error')
        }
        try {
            await changePassword({
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword,
            })
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
            showMessage('Password updated successfully!', 'success')
        } catch (error) {
            showMessage(error.response?.data?.message || 'Failed to update password', 'error')
        }
    }

    const handleDeleteAccount = async () => {
        if (!window.confirm('Are you sure? This action cannot be undone!')) return
        try {
            await deleteUser()
            localStorage.removeItem('user')
            localStorage.removeItem('token')
            navigate('/signup')
        } catch (error) {
            showMessage('Failed to delete account', error.response?.data?.message || 'error')
        }
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="bg-white rounded-xl border border-gray-200 px-6 py-4">
                <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
                <p className="text-sm text-gray-500 mt-0.5">Manage your account preferences</p>
            </div>

            {/* Toast Message */}
            {message.text && (
                <div className={`px-4 py-3 rounded-xl text-sm font-medium border ${message.type === 'success'
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                    {message.text}
                </div>
            )}

            <div className="flex gap-4 items-start">
                {/* Tabs Sidebar */}
                <div className="w-56 shrink-0 bg-white rounded-xl border border-gray-200 py-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm transition
                                ${activeTab === tab.id ? 'text-violet-600 bg-violet-50 font-medium' : 'text-gray-600 hover:bg-gray-50'}
                                ${tab.id === 'danger' ? '!text-red-500 hover:!bg-red-50 mt-1 border-t border-gray-100' : ''}
                            `}
                        >
                            <span className={activeTab === tab.id ? 'text-violet-600' : tab.id === 'danger' ? 'text-red-400' : 'text-gray-400'}>
                                {tab.icon}
                            </span>
                            {tab.label}
                            {activeTab === tab.id && <ChevronRight className="w-3.5 h-3.5 ml-auto text-violet-400" />}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">

                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
                            <div>
                                <h2 className="font-semibold text-gray-900">Profile Information</h2>
                                <p className="text-sm text-gray-500 mt-0.5">Update your personal details</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <img
                                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.userName}`}
                                    alt="avatar"
                                    className="w-16 h-16 rounded-full border-2 border-gray-200"
                                />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{user?.userName}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{user?.email}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { label: 'Username', name: 'userName', type: 'text' },
                                    { label: 'Email', name: 'email', type: 'email' },
                                    { label: 'GitHub Link', name: 'githubLink', type: 'text' },
                                    { label: 'LinkedIn Link', name: 'linkedinLink', type: 'text' },
                                ].map(field => (
                                    <div key={field.name}>
                                        <label className="block text-xs font-medium text-gray-700 mb-1.5">{field.label}</label>
                                        <input
                                            type={field.type}
                                            name={field.name}
                                            value={profileForm[field.name]}
                                            onChange={handleProfileChange}
                                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
                                        />
                                    </div>
                                ))}
                                <div className="col-span-2">
                                    <label className="block text-xs font-medium text-gray-700 mb-1.5">Portfolio Link</label>
                                    <input
                                        type="text"
                                        name="portFolioLink"
                                        value={profileForm.portFolioLink}
                                        onChange={handleProfileChange}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-medium text-gray-700 mb-1.5">Skills (comma separated)</label>
                                    <input
                                        type="text"
                                        name="skills"
                                        value={profileForm.skills}
                                        onChange={handleProfileChange}
                                        placeholder="React, Node.js, MongoDB..."
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end pt-2">
                                <button
                                    onClick={handleProfileSave}
                                    className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm px-4 py-2 rounded-lg transition"
                                >
                                    <Save className="w-4 h-4" /> Save Changes
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Password Tab */}
                    {activeTab === 'password' && (
                        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
                            <div>
                                <h2 className="font-semibold text-gray-900">Change Password</h2>
                                <p className="text-sm text-gray-500 mt-0.5">Make sure your password is strong</p>
                            </div>
                            <div className="space-y-4 max-w-md">
                                {[
                                    { label: 'Current Password', name: 'currentPassword' },
                                    { label: 'New Password', name: 'newPassword' },
                                    { label: 'Confirm New Password', name: 'confirmPassword' },
                                ].map(field => (
                                    <div key={field.name}>
                                        <label className="block text-xs font-medium text-gray-700 mb-1.5">{field.label}</label>
                                        <input
                                            type="password"
                                            name={field.name}
                                            value={passwordForm[field.name]}
                                            onChange={handlePasswordChange}
                                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-end pt-2">
                                <button
                                    onClick={handlePasswordSave}
                                    className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm px-4 py-2 rounded-lg transition"
                                >
                                    <Save className="w-4 h-4" /> Update Password
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Notifications Tab */}
                    {activeTab === 'notifications' && (
                        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
                            <div>
                                <h2 className="font-semibold text-gray-900">Notification Preferences</h2>
                                <p className="text-sm text-gray-500 mt-0.5">Choose what you want to be notified about</p>
                            </div>
                            <div className="space-y-1">
                                {[
                                    { key: 'applicationUpdates', label: 'Application Updates', desc: 'When your application status changes' },
                                    { key: 'newMessages', label: 'New Messages', desc: 'When you receive a new message' },
                                    { key: 'projectInvites', label: 'Project Invites', desc: 'When someone invites you to collaborate' },
                                    { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive updates via email' },
                                ].map(item => (
                                    <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{item.label}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                                        </div>
                                        <button
                                            onClick={() => handleToggle(item.key)}
                                            className={`relative w-10 h-5 rounded-full transition ${notifications[item.key] ? 'bg-violet-600' : 'bg-gray-200'}`}
                                        >
                                            <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${notifications[item.key] ? 'left-5' : 'left-0.5'}`} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Privacy Tab */}
                    {activeTab === 'privacy' && (
                        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
                            <div>
                                <h2 className="font-semibold text-gray-900">Privacy Settings</h2>
                                <p className="text-sm text-gray-500 mt-0.5">Control who can see your information</p>
                            </div>
                            <div className="space-y-1">
                                {[
                                    { label: 'Show GitHub Stats', desc: 'Display your GitHub activity on profile' },
                                    { label: 'Show Email', desc: 'Make your email visible to other users' },
                                    { label: 'Show Skills', desc: 'Display your skills on your profile' },
                                    { label: 'Public Profile', desc: 'Allow others to view your profile' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{item.label}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                                        </div>
                                        <button className="relative w-10 h-5 rounded-full bg-violet-600 transition">
                                            <span className="absolute top-0.5 left-5 w-4 h-4 bg-white rounded-full shadow" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Danger Zone */}
                    {activeTab === 'danger' && (
                        <div className="bg-white rounded-xl border border-red-200 p-6 space-y-5">
                            <div>
                                <h2 className="font-semibold text-red-600">Danger Zone</h2>
                                <p className="text-sm text-gray-500 mt-0.5">These actions are irreversible</p>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-4 border border-red-100 rounded-lg bg-red-50">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Delete Account</p>
                                        <p className="text-xs text-gray-500 mt-0.5">Permanently delete your account and all data</p>
                                    </div>
                                    <button
                                        onClick={handleDeleteAccount}
                                        className="text-sm text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg transition"
                                    >
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Settings;
