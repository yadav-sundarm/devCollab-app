import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MessageSquare, Bell } from 'lucide-react'

const Navbar = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const navigate = useNavigate()

    const handleSearch = (e) => {
        if (e.key === 'Enter') navigate(`/?search=${searchQuery}`)
    }

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 h-16">
            <div className="max-w-7xl mx-auto px-6 h-full flex items-center gap-6">

                {/* Logo */}
                <span
                    className="text-violet-600 font-bold text-xl cursor-pointer shrink-0 tracking-tight"
                    onClick={() => navigate('/')}
                >
                    Dev<span className="text-gray-900">Colab</span>
                </span>

                {/* Search */}
                <div className="flex-1 flex justify-center">
                    <div className="relative w-full max-w-2xl">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search projects by title, skill, or domain..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleSearch}
                            className="w-full bg-gray-100 rounded-lg pl-10 pr-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition placeholder:text-gray-400"
                        />
                    </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2 ml-auto">

                    {/* Messages */}
                    <button
                        onClick={() => navigate('/messages')}
                        className="relative p-2 text-gray-500 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition"
                        title="Messages"
                    >
                        <MessageSquare className="w-5 h-5" />
                    </button>

                    {/* Notifications */}
                    <button
                        onClick={() => navigate('/applications')} // reasonable placeholder
                        className="relative p-2 text-gray-500 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition"
                    >
                        <Bell className="w-5 h-5" />
                    </button>

                    {/* Login/Signup when logged out */}
                    {!localStorage.getItem('token') && (
                        <div className="flex items-center gap-2 ml-1">
                            <button
                                onClick={() => navigate('/login')}
                                className="text-sm text-gray-600 hover:text-violet-600 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition"
                            >
                                Login
                            </button>
                            <button
                                onClick={() => navigate('/signup')}
                                className="text-sm text-white bg-violet-600 hover:bg-violet-700 px-3 py-1.5 rounded-lg transition"
                            >
                                Sign up
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar;