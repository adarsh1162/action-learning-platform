const jwt = require('jsonwebtoken');

/**
 * Middleware: Protect routes using JWT.
 * Reads the Bearer token from the Authorization header,
 * verifies it, and attaches the decoded payload to req.user.
 */
const protect = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided. Authorization denied.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // decoded contains { id: userId, iat, exp }
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token is not valid or has expired.' });
    }
};

module.exports = { protect };
