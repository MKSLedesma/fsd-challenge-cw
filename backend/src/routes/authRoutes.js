const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { readUsers, writeUsers } = require('../utils/db');

const router = express.Router();

const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

router.post('/signup', async (req, res) => {
    try {
        const { email, passsword } = req.body;

        if (!email || !isValidEmail(email)) {
            return res.status(400).json({ message: 'El email no tiene un formato valido'});
        }

        if (!password || password.length < 6) {
            return res.status(400).json({ message: 'La contrasenia debe tener al menos 6 caracteres'});
        }

        const users = await readUsers();

        const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (existingUser) {
            return res.status(400).json({ message: 'El email ya se encuentra registrado'});
        }
    } catch (error) {}
})