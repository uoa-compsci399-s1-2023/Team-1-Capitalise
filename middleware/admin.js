const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

function admin(req, res, next) {
    if (req.user.userType != "admin") return res.status(403).send('Access Denied.');
    next();
}

module.exports = admin;