import { useNavigate } from 'react-router-dom'
import { Home, PlusSquare, FileText, LayoutDashboard, User, LogOut, LogIn, UserPlus } from 'lucide-react'

const Sidebar = () => {
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem('user'))
    const isLoggedIn = !!localStorage.getItem('token')

    const navItems = [
        { icon: <Home className="w-4 h-4" />, label: 'Home', path: '/' },
        { icon: <PlusSquare className="w-4 h-4" />, label: 'Post a Project', path: '/projects/createProject' },
        { icon: <FileText className="w-4 h-4" />, label: 'My Applications', path: '/applications' },
        { icon: <LayoutDashboard className="w-4 h-4" />, label: 'Dashboard', path: '/dashboard' },
        { icon: <User className="w-4 h-4" />, label: 'Profile', path: `/profile/${user?._id}` },
    ]

    return (
        <div className="space-y-2">
            {isLoggedIn && user && (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="h-14 bg-violet-600" />
                    <div className="px-4 pb-4">
                        <div className="-mt-7">
                            <img
                                src={user?.avatar || 'https://api.dicebear.com/7.x/initials/svg?seed=' + user?.userName}
                                alt="avatar"
                                onClick={() => navigate(`/profile/${user?._id}`)}
                                className="w-14 h-14 rounded-full border-2 border-white object-cover cursor-pointer"
                            />
                        </div>
                        <h3 className="font-semibold text-gray-900 text-sm mt-1">{user?.userName}</h3>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl border border-gray-200 py-1">
                <ul>
                    {navItems.map((item) => (
                        <li
                            key={item.label}
                            onClick={() => navigate(item.path)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer transition"
                        >
                            <span className="text-gray-400">{item.icon}</span>
                            {item.label}
                        </li>
                    ))}
                    <li className="border-t border-gray-100 mt-1 pt-1">
                        {isLoggedIn ? (
                            <button
                                onClick={() => {
                                    localStorage.removeItem('user')
                                    localStorage.removeItem('token')
                                    navigate('/')
                                }}
                                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 cursor-pointer transition"
                            >
                                <LogOut className="w-4 h-4" /> Logout
                            </button>
                        ) : (
                            <>
                                <button onClick={() => navigate('/login')} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition">
                                    <LogIn className="w-4 h-4 text-gray-400" /> Login
                                </button>
                                <button onClick={() => navigate('/signup')} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition">
                                    <UserPlus className="w-4 h-4 text-gray-400" /> Signup
                                </button>
                            </>
                        )}
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default Sidebar;