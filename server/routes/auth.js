const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { register, login } = require('../controllers/auth');

router.post('/register', register);
router.post('/login', login);

// Google OAuth — step 1: redirect to Google
router.get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

// Google OAuth — step 2: Google redirects back here
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