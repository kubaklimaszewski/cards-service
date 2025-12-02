const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../../config');

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization; 
    if (!authHeader) {
        return res.status(401).json({ success: false, message: 'Brak tokenu' });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({ success: false, message: 'Zły format tokenu' });
    }

    const token = parts[1];

    try {
        const payload = jwt.verify(token, jwtSecret);
        req.user = payload;
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: 'Nieprawidłowy lub wygasły token' });
    }
}

module.exports = authMiddleware;