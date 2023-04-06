const express = require('express');
const router = express.Router();

const {
    authenticateUser,
} = require('../controllers/authController')

router.post('/', authenticateUser);




module.exports = router;