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

// @route GET /api/inventory/dashboard
const getDashboardStats = async (req, res) => {
    try {
        const totalItems = await InventoryItem.countDocuments();

        const lowStockItems = await InventoryItem.find({
            $expr: { $lte: ['$quantity', '$lowStockThreshold'] },
        }).populate('category', 'name');

        const today = new Date();
        const sevenDaysFromNow = new Date();
        sevenDaysFromNow.setDate(today.getDate() + 7);

        const expiringItems = await InventoryItem.find({
            expiryDate: { $gte: today, $lte: sevenDaysFromNow },
        }).populate('category', 'name');

        const expiredItems = await InventoryItem.find({
            expiryDate: { $lt: today },
        }).populate('category', 'name');

        const categoryBreakdown = await InventoryItem.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                    totalQuantity: { $sum: '$quantity' },
                },
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'categoryData',
                },
            },
            {
                $project: {
                    name: {
                        $cond: {
                            if: { $gt: [{ $size: '$categoryData' }, 0] },
                            then: { $arrayElemAt: ['$categoryData.name', 0] },
                            else: 'Uncategorised',
                        },
                    },
                    count: 1,
                    totalQuantity: 1,
                },
            },
        ]);

        const recentItems = await InventoryItem.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('category', 'name');

        res.json({
            totalItems,
            lowStockCount: lowStockItems.length,
            expiringCount: expiringItems.length,
            expiredCount: expiredItems.length,
            lowStockItems,
            expiringItems,
            expiredItems,
            categoryBreakdown,
            recentItems,
        });
    } catch (err) {
        console.error('Dashboard error:', err);
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
    getDashboardStats,
};