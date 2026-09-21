const jwt = require('jsonwebtoken');

const SecretKey = process.env.JWT_SECRET || 'clave_secreta';

const authenticateToken = (req, res, next) => {
    const authorization = req.headers.authorization;
    const token = authorization?.startsWith('Bearer ')
        ? authorization.slice(7)
        : null;

    if (!token) {
        return res.status(401).json({ message: 'Token requerido' });
    }

    try {
        req.user = jwt.verify(token, SecretKey);
        return next();
    } catch (error) {
        return res.status(401).json({ message: 'Token invalido o expirado' });
    }
};

module.exports = authenticateToken;