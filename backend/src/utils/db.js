const fs = require('fs/promises');
const path = require('path');

const userFilePath = path.join(__dirname, '../../database/users.json');
const animalsFilePath = path.join(__dirname, '../../database/animals.json');

async function readUsers() {
    try {
        const data = await fs.readFile(userFilePath, 'utf-8');
        return JSON.parse(data || '[]');
    } catch (error) {
        if (error.code === 'ENOENT') {
            await fs.writeFile(userFilePath, '[]');
            return [];
        }
        throw error;
    }
}

async function writeUsers(users) {
    await fs.writeFile(userFilePath, JSON.stringify(users, null, 2), 'utf-8');
}

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
    readUsers,
    writeUsers,
    readAnimals
};