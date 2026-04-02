import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import AuthSuccess from './pages/AuthSuccess';
import Inventory from './pages/Inventory';
import ItemForm from './pages/ItemForm';
import Categories from './pages/Categories';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import QuickUpdate from './pages/QuickUpdate';



const App = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/auth/success" element={<AuthSuccess />} />
                    <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
                    <Route path="/inventory/new" element={<ProtectedRoute><ItemForm /></ProtectedRoute>} />
                    <Route path="/inventory/edit/:id" element={<ProtectedRoute><ItemForm /></ProtectedRoute>} />
                    <Route path="/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
                    <Route path="*" element={<Navigate to="/login" />} />
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="*" element={<NotFound />} />
                    <Route path="/quick-update" element={<ProtectedRoute><QuickUpdate /></ProtectedRoute>} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
};

export default App;