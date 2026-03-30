import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Button from '../components/ui/button';
import Input from '../components/ui/input';
import Select from '../components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';

const ItemForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [form, setForm] = useState({
        name: '', category: '', quantity: '', unit: '',
        lowStockThreshold: 10, expiryDate: '', notes: '',
    });
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        api.get('/categories').then(({ data }) => setCategories(data));
        if (isEdit) {
            api.get(`/inventory/${id}`).then(({ data }) => {
                setForm({
                    name: data.name,
                    category: data.category?._id || '',
                    quantity: data.quantity,
                    unit: data.unit || '',
                    lowStockThreshold: data.lowStockThreshold,
                    expiryDate: data.expiryDate ? data.expiryDate.split('T')[0] : '',
                    notes: data.notes || '',
                });
            });
        }
    }, [id]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (isEdit) {
                await api.put(`/inventory/${id}`, form);
            } else {
                await api.post('/inventory', form);
            }
            navigate('/inventory');
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-2xl mx-auto px-6 py-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">{isEdit ? 'Edit Item' : 'Add Item'}</h1>
                    <p className="text-sm text-gray-500 mt-0.5">{isEdit ? 'Update item details' : 'Add a new item to your inventory'}</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>Item details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input label="Name" type="text" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Full Cream Milk" required />

                            <div className="grid grid-cols-2 gap-4">
                                <Input label="Quantity" type="number" name="quantity" value={form.quantity} onChange={handleChange} placeholder="0" required />
                                <Input label="Unit" type="text" name="unit" value={form.unit} onChange={handleChange} placeholder="e.g. litres, kg" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Input label="Low Stock Threshold" type="number" name="lowStockThreshold" value={form.lowStockThreshold} onChange={handleChange} />
                                <Input label="Expiry Date" type="date" name="expiryDate" value={form.expiryDate} onChange={handleChange} />
                            </div>

                            <Select label="Category" name="category" value={form.category} onChange={handleChange}>
                                <option value="">No category</option>
                                {categories.map((c) => (
                                    <option key={c._id} value={c._id}>{c.name}</option>
                                ))}
                            </Select>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-gray-700">Notes</label>
                                <textarea
                                    name="notes"
                                    value={form.notes}
                                    onChange={handleChange}
                                    rows={3}
                                    placeholder="Any additional notes..."
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <Button type="submit" disabled={loading}>
                                    {loading ? 'Saving...' : isEdit ? 'Update Item' : 'Add Item'}
                                </Button>
                                <Button type="button" variant="outline" onClick={() => navigate('/inventory')}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ItemForm;