const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { readUsers, writeUsers } = require('../utils/db');

const router = express.Router();
const SecretKey = "clave_secreta"

const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

router.post('/signup', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !isValidEmail(email)) {
            return res.status(400).json({ message: 'El email no tiene un formato valido' });
        }

        if (!password || password.length < 6) {
            return res.status(400).json({ message: 'La contrasenia debe tener al menos 6 caracteres' });
        }

        const users = await readUsers();

        const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (existingUser) {
            return res.status(400).json({ message: 'El email ya se encuentra registrado' });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = {
            id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
            email: email.toLowerCase(),
            passwordHash
        };

        users.push(newUser);
        await writeUsers(users);

        return res.status(201).json({ message: 'Usuario registrado satisfactoriamente' });
    } catch (error) {
        console.error('Error en signup: ', error);
        return res.status(500).json({ message: 'Error interno' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Se requiere email y contrasenia' });
        }

        const users = await readUsers();
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (!user) {
            return res.status(401).json({ message: 'Email o contrasenia invalidos' });
        }

        const match = await bcrypt.compare(password, user.passwordHash);
        if (!match) {
            return res.status(401).json({ message: 'Email o contrasenia invalidos' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            SecretKey,
            { expiresIn: '8h' }
        );

        return res.status(200).json({
            token,
            user: {
                id: user.id,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Error en login: ', error);
        return res.status(500).json({ message: 'Error interno' });
    }
});

module.exports = router;