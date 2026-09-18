const fs = require('fs/promises');
const path = require('path');

const userFilePath = path.join(__dirname, '../../database/users.json');

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

module.exports = {
    readUsers,
    writeUsers
};