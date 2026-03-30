const { sendLowStockEmail } = require('../services/emailService');
const { sendLowStockAlert } = require('../services/telegramService');
const InventoryItem = require('../models/InventoryItem');

const checkAndNotify = async (item) => {
    if (item.quantity <= item.lowStockThreshold) {
        const populatedItem = await InventoryItem.findById(item._id).populate(
            'category',
            'name'
        );
        try {
            await Promise.all([
                sendLowStockEmail([populatedItem]),
                sendLowStockAlert([populatedItem]),
            ]);
        } catch (err) {
            console.error('Notification error:', err.message);
        }
    }
};

// @route GET /api/inventory
const getItems = async (req, res) => {
    try {
        const { search, category } = req.query;

        let filter = {};

        if (search) {
            filter.name = { $regex: search, $options: 'i' };
        }

        if (category) {
            filter.category = category;
        }

        const items = await InventoryItem.find(filter)
            .populate('category', 'name')
            .populate('addedBy', 'name email')
            .sort({ createdAt: -1 });

        res.json(items);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// @route GET /api/inventory/low-stock
const getLowStockItems = async (req, res) => {
    try {
        const items = await InventoryItem.find({
            $expr: { $lte: ['$quantity', '$lowStockThreshold'] },
        })
            .populate('category', 'name')
            .sort({ quantity: 1 });

        res.json(items);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// @route GET /api/inventory/:id
const getItemById = async (req, res) => {
    try {
        const item = await InventoryItem.findById(req.params.id)
            .populate('category', 'name')
            .populate('addedBy', 'name email');

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.json(item);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// @route POST /api/inventory
const createItem = async (req, res) => {
    try {
        const { name, category, quantity, unit, lowStockThreshold, expiryDate, notes } =
            req.body;

        const item = await InventoryItem.create({
            name,
            category,
            quantity,
            unit,
            lowStockThreshold,
            expiryDate,
            notes,
            addedBy: req.user._id,
        });

        await checkAndNotify(item);
        res.status(201).json(item);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// @route PUT /api/inventory/:id
const updateItem = async (req, res) => {
    try {
        const item = await InventoryItem.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        
        await checkAndNotify(item);
        res.json(item);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// @route DELETE /api/inventory/:id
const deleteItem = async (req, res) => {
    try {
        const item = await InventoryItem.findByIdAndDelete(req.params.id);

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.json({ message: 'Item deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = {
    getItems,
    getLowStockItems,
    getItemById,
    createItem,
    updateItem,
    deleteItem,
};