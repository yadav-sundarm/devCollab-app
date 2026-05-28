import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginService } from '../services/auth.services.js';

const Login = () => {
    const [userData, setUserData] = useState({
        email: '',
        password: '',
    })

    const navigate = useNavigate();

    const handleChange = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value,
        })
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await loginService(userData);
            navigate('/');
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <div>
            <form onSubmit={onSubmit}>
                <h2>Login</h2>
                <input type="email" name="email" placeholder="Email" value={userData.email} onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" value={userData.password} onChange={handleChange} required />
                <button type="submit">Login</button>
            </form>
        </div>
    )
}

export default Login;