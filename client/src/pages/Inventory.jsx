import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, Pencil, Trash2, AlertTriangle } from 'lucide-react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Button from '../components/ui/button';
import Badge from '../components/ui/badge';
import { Card } from '../components/ui/card';

const Inventory = () => {
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchItems = async () => {
        try {
            const params = {};
            if (search) params.search = search;
            if (categoryFilter) params.category = categoryFilter;
            const { data } = await api.get('/inventory', { params });
            setItems(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        const { data } = await api.get('/categories');
        setCategories(data);
    };

    useEffect(() => { fetchCategories(); }, []);
    useEffect(() => { fetchItems(); }, [search, categoryFilter]);

    const handleDelete = async (id) => {
        if (!confirm('Delete this item?')) return;
        await api.delete(`/inventory/${id}`);
        fetchItems();
    };

    const lowStockCount = items.filter(i => i.quantity <= i.lowStockThreshold).length;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-6xl mx-auto px-6 py-8">

                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Inventory</h1>
                        <p className="text-sm text-gray-500 mt-0.5">{items.length} items total</p>
                    </div>
                    <Link to="/inventory/new">
                        <Button>
                            <Plus size={16} />
                            Add Item
                        </Button>
                    </Link>
                </div>

                {lowStockCount > 0 && (
                    <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 flex items-center gap-3 mb-6">
                        <AlertTriangle size={16} className="text-amber-600 shrink-0" />
                        <p className="text-sm text-amber-700 font-medium">
                            {lowStockCount} item{lowStockCount > 1 ? 's are' : ' is'} running low on stock
                        </p>
                    </div>
                )}

                <div className="flex gap-3 mb-6">
                    <div className="relative flex-1">
                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search items..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter size={15} className="text-gray-400" />
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            <option value="">All categories</option>
                            {categories.map((c) => (
                                <option key={c._id} value={c._id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <Card>
                    {loading ? (
                        <div className="px-6 py-12 text-center text-sm text-gray-400">Loading...</div>
                    ) : items.length === 0 ? (
                        <div className="px-6 py-12 text-center">
                            <p className="text-gray-400 text-sm">No items found.</p>
                            <Link to="/inventory/new">
                                <Button size="sm" className="mt-3">Add your first item</Button>
                            </Link>
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-50">
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Name</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Category</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Quantity</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Expiry</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
                                    <th className="px-6 py-4" />
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => (
                                    <tr key={item._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition">
                                        <td className="px-6 py-4 font-medium text-gray-800">{item.name}</td>
                                        <td className="px-6 py-4">
                                            {item.category ? (
                                                <Badge variant="neutral">{item.category.name}</Badge>
                                            ) : '—'}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{item.quantity} {item.unit}</td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : '—'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant={item.quantity <= item.lowStockThreshold ? 'danger' : 'success'}>
                                                {item.quantity <= item.lowStockThreshold ? 'Low stock' : 'OK'}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 justify-end">
                                                <Link to={`/inventory/edit/${item._id}`}>
                                                    <Button variant="ghost" size="sm">
                                                        <Pencil size={14} />
                                                    </Button>
                                                </Link>
                                                <Button variant="danger" size="sm" onClick={() => handleDelete(item._id)}>
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

export default Inventory;