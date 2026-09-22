const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

const router = express.Router();
const SecretKey = process.env.JWT_SECRET || 'clave_secreta';

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

        const normalizedEmail = email.toLowerCase();
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(400).json({ message: 'El email ya se encuentra registrado' });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const lastUser = await User.findOne().sort({ id: -1 }).select('id').lean();
        const newUser = {
            id: lastUser ? lastUser.id + 1 : 1,
            email: normalizedEmail,
            passwordHash
        };

        await User.create(newUser);

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

        const user = await User.findOne({ email: email.toLowerCase() }).lean();

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