require('./config/env');
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const animalRoutes = require('./routes/animalRoutes');
const authenticateToken = require('./middleware/authMiddleware');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/animales', authenticateToken, animalRoutes);

module.exports = app;
