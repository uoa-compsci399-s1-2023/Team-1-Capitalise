const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

//Authorization for admin users. Simply checks the userType stored in the payload of the JSON WEB TOKEN. 
function graduate(req, res, next) {
    if (req.user.userType === "visitor") return res.status(403).send('Access Denied.');
    next();
}

module.exports = graduate;