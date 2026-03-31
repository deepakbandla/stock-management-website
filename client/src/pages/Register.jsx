import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/button';
import Input from '../components/ui/input';

const Register = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) { setError('Name is required'); return; }
        if (!form.email) { setError('Email is required'); return; }
        if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
        setLoading(true);
        setError('');
        try {
            const { data } = await api.post('/auth/register', form);
            login(data, data.token);
            navigate('/inventory');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogle = () => {
        window.location.href = 'http://localhost:5000/api/auth/google';
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="flex justify-center mb-8">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
                            <Package size={20} className="text-white" />
                        </div>
                        <span className="text-2xl font-bold text-gray-800">PantryPro</span>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                    <h1 className="text-xl font-semibold text-gray-800 mb-1">Create account</h1>
                    <p className="text-sm text-gray-500 mb-6">Get started with PantryPro</p>

                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input label="Name" type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your name" required />
                        <Input label="Email" type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
                        <Input label="Password" type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••" required />
                        <Button type="submit" disabled={loading} className="w-full">
                            {loading ? 'Creating account...' : 'Create account'}
                        </Button>
                    </form>

                    <div className="flex items-center gap-3 my-5">
                        <div className="flex-1 h-px bg-gray-100" />
                        <span className="text-xs text-gray-400">or continue with</span>
                        <div className="flex-1 h-px bg-gray-100" />
                    </div>

                    <Button variant="outline" className="w-full" onClick={handleGoogle}>
                        <img src="https://www.google.com/favicon.ico" className="w-4 h-4" />
                        Sign up with Google
                    </Button>

                    <p className="text-center text-sm text-gray-500 mt-6">
                        Already have an account?{' '}
                        <Link to="/login" className="text-green-600 font-medium hover:underline">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;