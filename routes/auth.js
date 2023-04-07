const express = require('express');
const router = express.Router();

const {
    authenticateUser,
} = require('../controllers/authController')

//Authenticates a user. 
router.post('/', authenticateUser);




module.exports = router;