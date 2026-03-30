const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const passport = require('./config/passport');
const authRoutes = require('./routes/auth');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'PantryPro API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));