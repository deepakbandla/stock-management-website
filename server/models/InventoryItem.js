const mongoose = require('mongoose');

const inventoryItemSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
        quantity: { type: Number, required: true, default: 0 },
        unit: { type: String, trim: true },
        lowStockThreshold: { type: Number, default: 10 },
        expiryDate: { type: Date },
        notes: { type: String, trim: true },
        addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
    { timestamps: true }
);

module.exports = mongoose.model('InventoryItem', inventoryItemSchema);