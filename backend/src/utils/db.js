const fs = require('fs/promises');
const path = require('path');

const userFilePath = path.join(__dirname, '../../database/users.json');
const animalsFilePath = path.join(__dirname, '../../database/animals.json');

async function readJsonFile(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data || '[]');
    } catch (error) {
        if (error.code === 'ENOENT') {
            await fs.writeFile(filePath, '[]');
            return [];
        }
        throw error;
    }
}

async function readUsers() {
    return readJsonFile(userFilePath);
}

async function writeUsers(users) {
    await fs.writeFile(userFilePath, JSON.stringify(users, null, 2), 'utf-8');
}

async function readAnimals() {
    return readJsonFile(animalsFilePath);
}

module.exports = {
    readUsers,
    writeUsers,
    readAnimals
};