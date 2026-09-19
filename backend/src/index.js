const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const animalRoutes = require('./routes/animalRoutes');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/animales', animalRoutes);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
});