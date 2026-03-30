import { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Button from '../components/ui/button';
import Input from '../components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({ name: '', description: '' });
    const [editId, setEditId] = useState(null);
    const [error, setError] = useState('');

    const fetchCategories = async () => {
        const { data } = await api.get('/categories');
        setCategories(data);
    };

    useEffect(() => { fetchCategories(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (editId) {
                await api.put(`/categories/${editId}`, form);
                setEditId(null);
            } else {
                await api.post('/categories', form);
            }
            setForm({ name: '', description: '' });
            fetchCategories();
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        }
    };

    const handleEdit = (cat) => {
        setEditId(cat._id);
        setForm({ name: cat.name, description: cat.description || '' });
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this category?')) return;
        await api.delete(`/categories/${id}`);
        fetchCategories();
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-2xl mx-auto px-6 py-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Organise your inventory items</p>
                </div>

                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>{editId ? 'Edit Category' : 'Add Category'}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {error && (
                            <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
                                {error}
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <Input type="text" placeholder="Category name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                            <Input type="text" placeholder="Description (optional)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                            <div className="flex gap-2">
                                <Button type="submit">
                                    <Plus size={15} />
                                    {editId ? 'Update' : 'Add Category'}
                                </Button>
                                {editId && (
                                    <Button type="button" variant="outline" onClick={() => { setEditId(null); setForm({ name: '', description: '' }); }}>
                                        Cancel
                                    </Button>
                                )}
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    {categories.length === 0 ? (
                        <div className="px-6 py-12 text-center text-sm text-gray-400">No categories yet.</div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-50">
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Name</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Description</th>
                                    <th className="px-6 py-4" />
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((cat) => (
                                    <tr key={cat._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition">
                                        <td className="px-6 py-4 font-medium text-gray-800">{cat.name}</td>
                                        <td className="px-6 py-4 text-gray-500">{cat.description || '—'}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 justify-end">
                                                <Button variant="ghost" size="sm" onClick={() => handleEdit(cat)}>
                                                    <Pencil size={14} />
                                                </Button>
                                                <Button variant="danger" size="sm" onClick={() => handleDelete(cat._id)}>
                                                    <Trash2 size={14} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default Categories;