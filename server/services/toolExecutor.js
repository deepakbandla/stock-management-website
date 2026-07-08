const InventoryItem = require('../models/InventoryItem');
const Category = require('../models/Category');

const getAllItems = async () => {
    const items = await InventoryItem.find()
        .populate('category', 'name')
        .sort({ name: 1 });
    return items.map((i) => ({
        name: i.name,
        quantity: i.quantity,
        unit: i.unit || '',
        category: i.category?.name || 'Uncategorised',
        lowStockThreshold: i.lowStockThreshold,
        expiryDate: i.expiryDate || null,
        isLowStock: i.quantity <= i.lowStockThreshold,
    }));
};

const getLowStockItems = async () => {
    const items = await InventoryItem.find({
        $expr: { $lte: ['$quantity', '$lowStockThreshold'] },
    }).populate('category', 'name');
    return items.map((i) => ({
        name: i.name,
        quantity: i.quantity,
        unit: i.unit || '',
        category: i.category?.name || 'Uncategorised',
        lowStockThreshold: i.lowStockThreshold,
    }));
};

const getItemByName = async ({ name }) => {
    const item = await InventoryItem.findOne({
        name: { $regex: name, $options: 'i' },
    }).populate('category', 'name');
    if (!item) return { found: false, message: `No item found matching "${name}"` };
    return {
        found: true,
        name: item.name,
        quantity: item.quantity,
        unit: item.unit || '',
        category: item.category?.name || 'Uncategorised',
        lowStockThreshold: item.lowStockThreshold,
        expiryDate: item.expiryDate || null,
        isLowStock: item.quantity <= item.lowStockThreshold,
        notes: item.notes || '',
    };
};

const getItemsByCategory = async ({ category }) => {
    const cat = await Category.findOne({
        name: { $regex: category, $options: 'i' },
    });
    if (!cat) return { found: false, message: `No category found matching "${category}"` };
    const items = await InventoryItem.find({ category: cat._id }).populate('category', 'name');
    return {
        found: true,
        category: cat.name,
        count: items.length,
        items: items.map((i) => ({
            name: i.name,
            quantity: i.quantity,
            unit: i.unit || '',
            lowStockThreshold: i.lowStockThreshold,
            isLowStock: i.quantity <= i.lowStockThreshold,
        })),
    };
};

const getInventorySummary = async () => {
    const total = await InventoryItem.countDocuments();
    const lowStock = await InventoryItem.countDocuments({
        $expr: { $lte: ['$quantity', '$lowStockThreshold'] },
    });
    const today = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(today.getDate() + 7);
    const expiringSoon = await InventoryItem.countDocuments({
        expiryDate: { $gte: today, $lte: sevenDaysFromNow },
    });
    const expired = await InventoryItem.countDocuments({
        expiryDate: { $lt: today },
    });
    const categories = await Category.countDocuments();

    const lowestStock = await InventoryItem.findOne()
        .sort({ quantity: 1 })
        .populate('category', 'name');
    const highestStock = await InventoryItem.findOne()
        .sort({ quantity: -1 })
        .populate('category', 'name');

    return {
        totalItems: total,
        lowStockCount: lowStock,
        expiringSoonCount: expiringSoon,
        expiredCount: expired,
        categoryCount: categories,
        lowestStockItem: lowestStock
            ? { name: lowestStock.name, quantity: lowestStock.quantity, unit: lowestStock.unit || '' }
            : null,
        highestStockItem: highestStock
            ? { name: highestStock.name, quantity: highestStock.quantity, unit: highestStock.unit || '' }
            : null,
    };
};

const getAboveThresholdItems = async () => {
    const items = await InventoryItem.find({
        $expr: { $gt: ['$quantity', '$lowStockThreshold'] },
    }).populate('category', 'name');
    return items.map((i) => ({
        name: i.name,
        quantity: i.quantity,
        unit: i.unit || '',
        category: i.category?.name || 'Uncategorised',
        lowStockThreshold: i.lowStockThreshold,
    }));
};

const executeTool = async (toolName, toolArgs) => {
    switch (toolName) {
        case 'getAllItems': return await getAllItems();
        case 'getLowStockItems': return await getLowStockItems();
        case 'getItemByName': return await getItemByName(toolArgs);
        case 'getItemsByCategory': return await getItemsByCategory(toolArgs);
        case 'getInventorySummary': return await getInventorySummary();
        case 'getAboveThresholdItems': return await getAboveThresholdItems();
        default: return { error: `Unknown tool: ${toolName}` };
    }
};

module.exports = { executeTool };