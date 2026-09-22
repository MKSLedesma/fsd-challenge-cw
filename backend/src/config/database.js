const mongoose = require('mongoose');

const connectDatabase = async () => {
    const connectionString = process.env.MONGODB_URI;

    if (!connectionString) {
        throw new Error('Falta la variable de entorno MONGODB_URI');
    }

    await mongoose.connect(connectionString);
    console.log('Conectado a MongoDB');
};

module.exports = connectDatabase;
