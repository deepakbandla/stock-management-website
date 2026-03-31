const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { categoryValidator } = require('../middleware/validators');
const {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} = require('../controllers/category');

router.get('/', protect, getCategories);
router.post('/', protect, categoryValidator, validate, createCategory);
router.put('/:id', protect, categoryValidator, validate, updateCategory);
router.delete('/:id', protect, deleteCategory);

module.exports = router;