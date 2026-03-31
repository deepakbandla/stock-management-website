const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { register, login } = require('../controllers/auth');
const validate = require('../middleware/validate');
const { registerValidator, loginValidator } = require('../middleware/validators');

router.post('/register', registerValidator, validate, register);
router.post('/login', loginValidator, validate, login);

router.get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/login', session: false }),
    (req, res) => {
        const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });
        res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${token}`);
    }
);

module.exports = router;