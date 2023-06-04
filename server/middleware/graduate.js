const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

//Authorization for graduate users. Simply checks the userType stored in the payload of the JSON WEB TOKEN. 
function graduate(req, res, next) {
    if (req.user.userType === "visitor") return res.status(403).send('Access Denied. You do not have the relevant permissions to access this resource!');
    next();
}

module.exports = graduate;