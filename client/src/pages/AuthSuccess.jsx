import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthSuccess = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            login({ _id: payload.id }, token);
            navigate('/inventory');
        } else {
            navigate('/login');
        }
    }, []);

    return (
        <div className="flex items-center justify-center h-screen">
            <p className="text-gray-500">Signing you in...</p>
        </div>
    );
};

export default AuthSuccess;