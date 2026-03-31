const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { itemValidator } = require('../middleware/validators');
const {
    getItems,
    getLowStockItems,
    getItemById,
    createItem,
    updateItem,
    deleteItem,
    getDashboardStats,
} = require('../controllers/inventory');

router.get('/dashboard', protect, getDashboardStats);
router.get('/low-stock', protect, getLowStockItems);
router.get('/', protect, getItems);
router.get('/:id', protect, getItemById);
router.post('/', protect, itemValidator, validate, createItem);
router.put('/:id', protect, itemValidator, validate, updateItem);
router.delete('/:id', protect, deleteItem);

module.exports = router;