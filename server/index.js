const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const passport = require('./config/passport');
const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/category');
const inventoryRoutes = require('./routes/inventory');

const app = express();

connectDB();

const allowedOrigins = process.env.CLIENT_URLS.split(",");

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true); 

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));
app.use(express.json());
app.use(passport.initialize());

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/inventory', inventoryRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'PantryPro API is running' });
});

const PORT = process.env.PORT || 5000;
// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'Internal server error',
    });
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));