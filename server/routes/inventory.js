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
} = require('../controllers/inventory');

router.get('/low-stock', protect, getLowStockItems);
router.get('/', protect, getItems);
router.get('/:id', protect, getItemById);
router.post('/', protect, createItem);
router.put('/:id', protect, updateItem);
router.delete('/:id', protect, deleteItem);

module.exports = router;