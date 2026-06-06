import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem('user'))

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            navigate(`/?search=${searchQuery}`)
        }
    }

    return (
        <nav>
            <div onClick={() => navigate('/')}>DevColab</div>
            <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
            />
            <div>
                <button onClick={() => navigate('/messages')}>Chat</button>
                <img
                    src={user?.avatar || '/default-avatar.png'}
                    onClick={() => navigate(`/profile/${user?._id}`)}
                    alt="profile"
                />
            </div>
        </nav>
    )
}

export default Navbar