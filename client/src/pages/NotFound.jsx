import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import Button from '../components/ui/button';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Package size={28} className="text-green-600" />
                </div>
                <h1 className="text-4xl font-bold text-gray-800 mb-2">404</h1>
                <p className="text-gray-500 text-sm mb-6">This page doesn't exist.</p>
                <Link to="/inventory">
                    <Button>Go to Inventory</Button>
                </Link>
            </div>
        </div>
    );
};

export default NotFound;