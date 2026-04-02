import { useState, useEffect, useRef } from 'react';
import { Search, Plus, Trash2, Zap, CheckCircle, AlertTriangle, XCircle, X } from 'lucide-react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Button from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import Badge from '../components/ui/badge';

const ResultsModal = ({ results, onClose }) => {
    const total =
        results.success.length +
        results.lowStock.length +
        results.depleted.length;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col">
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">Update Summary</h2>
                        <p className="text-sm text-gray-500 mt-0.5">{total} item{total !== 1 ? 's' : ''} updated</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                        <X size={20} />
                    </button>
                </div>

                <div className="overflow-y-auto flex-1 px-6 py-4 space-y-4">
                    {results.depleted.length > 0 && (
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <XCircle size={15} className="text-red-500" />
                                <span className="text-sm font-semibold text-red-600">Out of Stock ({results.depleted.length})</span>
                            </div>
                            <div className="space-y-2">
                                {results.depleted.map((item) => (
                                    <div key={item._id} className="bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-800">{item.name}</p>
                                                <p className="text-xs text-gray-500">{item.category}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-gray-400">Used: {item.usageAmount} {item.unit}</p>
                                                <p className="text-xs font-semibold text-red-600">0 {item.unit} remaining</p>
                                            </div>
                                        </div>
                                        <p className="text-xs text-red-500 mt-1.5">⚠️ Alert sent via Gmail and Telegram</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {results.lowStock.length > 0 && (
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <AlertTriangle size={15} className="text-amber-500" />
                                <span className="text-sm font-semibold text-amber-600">Low Stock ({results.lowStock.length})</span>
                            </div>
                            <div className="space-y-2">
                                {results.lowStock.map((item) => (
                                    <div key={item._id} className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-800">{item.name}</p>
                                                <p className="text-xs text-gray-500">{item.category}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-gray-400">Used: {item.usageAmount} {item.unit}</p>
                                                <p className="text-xs font-semibold text-amber-600">{item.newQuantity} {item.unit} remaining</p>
                                            </div>
                                        </div>
                                        <p className="text-xs text-amber-500 mt-1.5">⚠️ Alert sent via Gmail and Telegram</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {results.success.length > 0 && (
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <CheckCircle size={15} className="text-green-500" />
                                <span className="text-sm font-semibold text-green-600">Updated Successfully ({results.success.length})</span>
                            </div>
                            <div className="space-y-2">
                                {results.success.map((item) => (
                                    <div key={item._id} className="bg-green-50 border border-green-100 rounded-xl px-4 py-3">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-800">{item.name}</p>
                                                <p className="text-xs text-gray-500">{item.category}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-gray-400">Used: {item.usageAmount} {item.unit}</p>
                                                <p className="text-xs font-semibold text-green-600">{item.newQuantity} {item.unit} remaining</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {results.errors && results.errors.length > 0 && (
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <XCircle size={15} className="text-gray-400" />
                                <span className="text-sm font-semibold text-gray-500">Errors ({results.errors.length})</span>
                            </div>
                            {results.errors.map((err, i) => (
                                <p key={i} className="text-xs text-gray-400">{err.message}</p>
                            ))}
                        </div>
                    )}
                </div>

                <div className="px-6 py-4 border-t border-gray-100">
                    <Button className="w-full" onClick={onClose}>Done</Button>
                </div>
            </div>
        </div>
    );
};

const QuickUpdate = () => {
    const [allItems, setAllItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [search, setSearch] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [overConsumptionWarnings, setOverConsumptionWarnings] = useState([]);
    const searchRef = useRef(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        api.get('/inventory').then(({ data }) => setAllItems(data));
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target) &&
                !searchRef.current.contains(e.target)
            ) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredItems = allItems.filter((item) => {
        const alreadySelected = selectedItems.some((s) => s._id === item._id);
        const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
        return !alreadySelected && matchesSearch;
    });

    const handleSelectItem = (item) => {
        setSelectedItems((prev) => [
            ...prev,
            { ...item, usageAmount: '' },
        ]);
        setSearch('');
        setShowDropdown(false);
    };

    const handleRemoveItem = (id) => {
        setSelectedItems((prev) => prev.filter((i) => i._id !== id));
        setOverConsumptionWarnings((prev) => prev.filter((w) => w !== id));
    };

    const handleUsageChange = (id, value) => {
        const numVal = parseFloat(value);
        setSelectedItems((prev) =>
            prev.map((item) =>
                item._id === id ? { ...item, usageAmount: value } : item
            )
        );

        const item = selectedItems.find((i) => i._id === id);
        if (item && numVal > item.quantity) {
            setOverConsumptionWarnings((prev) =>
                prev.includes(id) ? prev : [...prev, id]
            );
        } else {
            setOverConsumptionWarnings((prev) => prev.filter((w) => w !== id));
        }
    };

    const handleSubmit = async () => {
        const validItems = selectedItems.filter(
            (item) => item.usageAmount !== '' && parseFloat(item.usageAmount) > 0
        );

        if (validItems.length === 0) {
            alert('Please enter a usage amount for at least one item.');
            return;
        }

        const updates = validItems.map((item) => ({
            itemId: item._id,
            usageAmount: parseFloat(item.usageAmount),
        }));

        setLoading(true);
        try {
            const { data } = await api.post('/inventory/bulk-update', { updates });
            setResults(data.results);

            // refresh allItems so quantities are up to date
            const refreshed = await api.get('/inventory');
            setAllItems(refreshed.data);
            setSelectedItems([]);
            setOverConsumptionWarnings([]);
        } catch (err) {
            alert(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const totalItemsToUpdate = selectedItems.filter(
        (i) => i.usageAmount !== '' && parseFloat(i.usageAmount) > 0
    ).length;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            {results && (
                <ResultsModal results={results} onClose={() => setResults(null)} />
            )}

            <div className="max-w-3xl mx-auto px-6 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">Quick Update</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Search for items and log how much you used in one go
                    </p>
                </div>

                {/* Search + dropdown */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Select items to update</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative">
                            <div className="relative">
                                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    ref={searchRef}
                                    type="text"
                                    placeholder="Search inventory items..."
                                    value={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                        setShowDropdown(true);
                                    }}
                                    onFocus={() => setShowDropdown(true)}
                                    className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>

                            {showDropdown && (
                                <div
                                    ref={dropdownRef}
                                    className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-lg z-20 max-h-56 overflow-y-auto"
                                >
                                    {filteredItems.length === 0 ? (
                                        <p className="text-sm text-gray-400 px-4 py-3">
                                            {search ? 'No matching items found' : 'All items already selected'}
                                        </p>
                                    ) : (
                                        filteredItems.map((item) => (
                                            <button
                                                key={item._id}
                                                onClick={() => handleSelectItem(item)}
                                                className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition text-left"
                                            >
                                                <div>
                                                    <p className="text-sm font-medium text-gray-800">{item.name}</p>
                                                    <p className="text-xs text-gray-400">{item.category?.name || 'Uncategorised'}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant={item.quantity <= item.lowStockThreshold ? 'danger' : 'success'}>
                                                        {item.quantity} {item.unit}
                                                    </Badge>
                                                    <Plus size={14} className="text-green-600" />
                                                </div>
                                            </button>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Selected items */}
                {selectedItems.length > 0 && (
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Usage amounts</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {selectedItems.map((item) => {
                                    const isOverConsumed = overConsumptionWarnings.includes(item._id);
                                    const usageNum = parseFloat(item.usageAmount);
                                    const willDeplete = !isNaN(usageNum) && usageNum >= item.quantity;
                                    const willLowStock =
                                        !isNaN(usageNum) &&
                                        usageNum < item.quantity &&
                                        item.quantity - usageNum <= item.lowStockThreshold;

                                    return (
                                        <div
                                            key={item._id}
                                            className={`rounded-xl border px-4 py-3 transition ${willDeplete
                                                    ? 'border-red-200 bg-red-50'
                                                    : willLowStock
                                                        ? 'border-amber-200 bg-amber-50'
                                                        : 'border-gray-100 bg-white'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-0.5">
                                                        <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                                                        {item.category?.name && (
                                                            <Badge variant="neutral">{item.category.name}</Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-400">
                                                        Current stock: <span className="font-medium text-gray-600">{item.quantity} {item.unit}</span>
                                                        {' · '}Threshold: {item.lowStockThreshold} {item.unit}
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-2 shrink-0">
                                                    <div className="relative">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            placeholder="0"
                                                            value={item.usageAmount}
                                                            onChange={(e) => handleUsageChange(item._id, e.target.value)}
                                                            className={`w-24 border rounded-lg px-3 py-2 text-sm text-center focus:outline-none focus:ring-2 transition ${willDeplete
                                                                    ? 'border-red-300 focus:ring-red-400 bg-white'
                                                                    : willLowStock
                                                                        ? 'border-amber-300 focus:ring-amber-400 bg-white'
                                                                        : 'border-gray-200 focus:ring-green-500 bg-white'
                                                                }`}
                                                        />
                                                        {item.unit && (
                                                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-300 pointer-events-none">
                                                                {item.unit}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <button
                                                        onClick={() => handleRemoveItem(item._id)}
                                                        className="text-gray-300 hover:text-red-400 transition p-1"
                                                    >
                                                        <Trash2 size={15} />
                                                    </button>
                                                </div>
                                            </div>

                                            {willDeplete && (
                                                <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                                                    <XCircle size={12} />
                                                    This will completely deplete the stock — quantity will be set to 0
                                                </p>
                                            )}
                                            {willLowStock && !willDeplete && (
                                                <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                                                    <AlertTriangle size={12} />
                                                    This will trigger a low stock alert
                                                </p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Submit */}
                {selectedItems.length > 0 && (
                    <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4">
                        <p className="text-sm text-gray-500">
                            {totalItemsToUpdate} item{totalItemsToUpdate !== 1 ? 's' : ''} ready to update
                        </p>
                        <Button onClick={handleSubmit} disabled={loading || totalItemsToUpdate === 0}>
                            <Zap size={15} />
                            {loading ? 'Updating...' : 'Submit Update'}
                        </Button>
                    </div>
                )}

                {selectedItems.length === 0 && (
                    <div className="text-center py-16">
                        <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Zap size={24} className="text-green-600" />
                        </div>
                        <p className="text-gray-400 text-sm">Search for items above to get started</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuickUpdate;