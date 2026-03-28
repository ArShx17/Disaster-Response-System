const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { dbConfig } = require('../config/db');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

            // Get user from the token
            if (!dbConfig.isConnected) {
                const user = User.mockUsers.find(u => u._id === decoded.id);
                if (!user) throw new Error('Not authorized');
                // Remove password
                req.user = { _id: user._id, name: user.name, email: user.email, role: user.role };
            } else {
                req.user = await User.findById(decoded.id).select('-password');
                if (!req.user) throw new Error('Not authorized');
            }

            next();
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = { protect, admin };
