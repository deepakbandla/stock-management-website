const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    getItems,
    getLowStockItems,
    getItemById,
    createItem,
    updateItem,
    deleteItem,
    getDashboardStats, 
} = require('../controllers/inventory');

// add this route at the top with the other GETs
router.get('/dashboard', protect, getDashboardStats);

router.get('/low-stock', protect, getLowStockItems);
router.get('/', protect, getItems);
router.get('/:id', protect, getItemById);
router.post('/', protect, createItem);
router.put('/:id', protect, updateItem);
router.delete('/:id', protect, deleteItem);

module.exports = router;