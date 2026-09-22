const app = require('./app');
const connectDatabase = require('./config/database');
const PORT = process.env.PORT || 4000;

connectDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('No se pudo conectar a MongoDB:', error.message);
        process.exit(1);
    });