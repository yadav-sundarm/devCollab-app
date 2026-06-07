import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const ProtectedRoutes = ({ children }) => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    return token ? children : null;
};


export default ProtectedRoutes;
