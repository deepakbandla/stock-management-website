import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Package, Tag, LogOut, Zap } from 'lucide-react';

import { cn } from '../lib/utils';


const navLinks = [
    { to: '/inventory', label: 'Inventory', icon: Package },
    { to: '/quick-update', label: 'Quick Update', icon: Zap },
    { to: '/categories', label: 'Categories', icon: Tag },
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
];

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link to="/inventory" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                        <Package size={16} className="text-white" />
                    </div>
                    <span className="font-bold text-gray-800 text-lg">PantryPro</span>
                </Link>

                <div className="flex items-center gap-1">
                    {navLinks.map(({ to, label, icon: Icon }) => (
                        <Link
                            key={to}
                            to={to}
                            className={cn(
                                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                                pathname === to
                                    ? 'bg-green-50 text-green-700'
                                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                            )}
                        >
                            <Icon size={15} />
                            {label}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="text-xs font-semibold text-green-700">
                            {user?.name?.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <span className="text-sm text-gray-600 hidden md:block">{user?.name}</span>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-500 transition ml-2"
                    >
                        <LogOut size={15} />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;