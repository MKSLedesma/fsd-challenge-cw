require('./config/env');
const fs = require('fs/promises');
const path = require('path');
const mongoose = require('mongoose');
const connectDatabase = require('./config/database');
const Animal = require('./models/animales');

const animalsFilePath = path.join(__dirname, '../database/animals.json');

const seedAnimals = async () => {
    const data = await fs.readFile(animalsFilePath, 'utf-8');
    const animals = JSON.parse(data || '[]');

    await connectDatabase();
    await Animal.deleteMany({});
    await Animal.insertMany(animals);
    console.log(`${animals.length} animales cargados en MongoDB`);
};

seedAnimals()
    .catch((error) => {
        console.error('No se pudieron cargar los animales:', error.message);
        process.exitCode = 1;
    })
    .finally(async () => {
        await mongoose.disconnect();
    });
