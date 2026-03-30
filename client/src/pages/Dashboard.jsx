import { useState, useEffect } from 'react';
import { AlertTriangle, Package, Tag, Clock } from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from 'recharts';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import Badge from '../components/ui/badge';

const COLORS = ['#16a34a', '#2563eb', '#d97706', '#dc2626', '#7c3aed', '#0891b2'];

const StatCard = ({ label, value, icon: Icon, variant = 'neutral' }) => {
    const colors = {
        neutral: 'bg-gray-50 text-gray-600',
        success: 'bg-green-50 text-green-600',
        warning: 'bg-amber-50 text-amber-600',
        danger: 'bg-red-50 text-red-600',
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-500">{label}</span>
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${colors[variant]}`}>
                    <Icon size={18} />
                </div>
            </div>
            <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
    );
};

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/inventory/dashboard')
            .then(({ data }) => setStats(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex items-center justify-center h-96">
                    <p className="text-gray-400 text-sm">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex items-center justify-center h-96">
                    <p className="text-red-400 text-sm">Failed to load dashboard. Make sure the server is running.</p>
                </div>
            </div>
        );
    }

    const barData = stats.categoryBreakdown.map((c) => ({
        name: c.name,
        items: c.count,
        quantity: c.totalQuantity,
    }));

    const pieData = stats.categoryBreakdown.map((c) => ({
        name: c.name,
        value: c.count,
    }));

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-6xl mx-auto px-6 py-8">

                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Overview of your inventory</p>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <StatCard label="Total Items" value={stats.totalItems} icon={Package} variant="success" />
                    <StatCard label="Low Stock" value={stats.lowStockCount} icon={AlertTriangle} variant={stats.lowStockCount > 0 ? 'warning' : 'neutral'} />
                    <StatCard label="Expiring Soon" value={stats.expiringCount} icon={Clock} variant={stats.expiringCount > 0 ? 'warning' : 'neutral'} />
                    <StatCard label="Expired" value={stats.expiredCount} icon={Tag} variant={stats.expiredCount > 0 ? 'danger' : 'neutral'} />
                </div>

                {/* Charts row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

                    <Card>
                        <CardHeader>
                            <CardTitle>Items by category</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {barData.length === 0 ? (
                                <p className="text-sm text-gray-400 text-center py-8">No data yet</p>
                            ) : (
                                <ResponsiveContainer width="100%" height={240}>
                                    <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                        <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#9ca3af' }} />
                                        <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '8px', border: '1px solid #f3f4f6', fontSize: '13px' }}
                                        />
                                        <Bar dataKey="items" fill="#16a34a" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Stock distribution</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {pieData.length === 0 ? (
                                <p className="text-sm text-gray-400 text-center py-8">No data yet</p>
                            ) : (
                                <ResponsiveContainer width="100%" height={240}>
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={90}
                                            paddingAngle={3}
                                            dataKey="value"
                                        >
                                            {pieData.map((_, index) => (
                                                <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ borderRadius: '8px', border: '1px solid #f3f4f6', fontSize: '13px' }}
                                        />
                                        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Bottom row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Low stock list */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Low stock items</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {stats.lowStockItems.length === 0 ? (
                                <p className="text-sm text-gray-400">All items are well stocked.</p>
                            ) : (
                                <div className="space-y-3">
                                    {stats.lowStockItems.map((item) => (
                                        <div key={item._id} className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-800">{item.name}</p>
                                                <p className="text-xs text-gray-400">{item.category?.name || 'Uncategorised'}</p>
                                            </div>
                                            <Badge variant="danger">{item.quantity} {item.unit} left</Badge>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Expiring soon list */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Expiring within 7 days</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {stats.expiringItems.length === 0 ? (
                                <p className="text-sm text-gray-400">No items expiring soon.</p>
                            ) : (
                                <div className="space-y-3">
                                    {stats.expiringItems.map((item) => (
                                        <div key={item._id} className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-800">{item.name}</p>
                                                <p className="text-xs text-gray-400">{item.category?.name || 'Uncategorised'}</p>
                                            </div>
                                            <Badge variant="warning">
                                                {new Date(item.expiryDate).toLocaleDateString()}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    );
};

export default Dashboard;