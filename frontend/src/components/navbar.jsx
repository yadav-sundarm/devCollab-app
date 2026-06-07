import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MessageSquare, LayoutDashboard, Home } from 'lucide-react'

const Navbar = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem('user'))

    const handleSearch = (e) => {
        if (e.key === 'Enter') navigate(`/?search=${searchQuery}`)
    }

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 h-14">
            <div className="max-w-5xl mx-auto px-4 h-full flex items-center gap-4">
                <span
                    className="text-violet-600 font-bold text-xl cursor-pointer shrink-0 tracking-tight"
                    onClick={() => navigate('/')}
                >
                    DevColab
                </span>

                <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search projects..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearch}
                        className="bg-gray-100 rounded-md pl-8 pr-4 py-1.5 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition"
                    />
                </div>

                <div className="flex items-center gap-1 ml-auto">
                    {[
                        { icon: <Home className="w-5 h-5" />, label: 'Home', path: '/' },
                        { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard', path: '/dashboard' },
                        { icon: <MessageSquare className="w-5 h-5" />, label: 'Messages', path: '/messages' },
                    ].map(item => (
                        <button
                            key={item.label}
                            onClick={() => navigate(item.path)}
                            className="flex flex-col items-center px-3 py-1 text-gray-500 hover:text-violet-600 hover:bg-gray-50 rounded-md transition cursor-pointer"
                        >
                            {item.icon}
                            <span className="text-xs mt-0.5">{item.label}</span>
                        </button>
                    ))}

                    <div className="w-px h-8 bg-gray-200 mx-2" />

                    <img
                        src={user?.avatar || 'https://api.dicebear.com/7.x/initials/svg?seed=' + user?.userName}
                        onClick={() => navigate(`/profile/${user?._id}`)}
                        alt="profile"
                        className="w-8 h-8 rounded-full object-cover cursor-pointer border border-gray-200 hover:border-violet-400 transition"
                    />
                </div>
            </div>
        </nav>
    )
}

export default Navbar;