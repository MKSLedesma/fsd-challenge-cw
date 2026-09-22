const fs = require('fs/promises');
const path = require('path');

const animalsFilePath = path.join(__dirname, '../../database/animals.json');

async function readAnimals() {
    try {
        const data = await fs.readFile(animalsFilePath, 'utf-8');
        return JSON.parse(data || '[]');
    } catch (error) {
        if (error.code === 'ENOENT') {
            await fs.writeFile(animalsFilePath, '[]');
            return [];
        }
        throw error;
    }
}

module.exports = {
    readAnimals
};