const { body } = require('express-validator');

const registerValidator = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const loginValidator = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
];

const itemValidator = [
    body('name').trim().notEmpty().withMessage('Item name is required'),
    body('quantity')
        .notEmpty().withMessage('Quantity is required')
        .isNumeric().withMessage('Quantity must be a number')
        .custom((val) => val >= 0).withMessage('Quantity cannot be negative'),
    body('lowStockThreshold')
        .optional()
        .isNumeric().withMessage('Threshold must be a number')
        .custom((val) => val >= 0).withMessage('Threshold cannot be negative'),
];

const categoryValidator = [
    body('name').trim().notEmpty().withMessage('Category name is required'),
];

module.exports = { registerValidator, loginValidator, itemValidator, categoryValidator };