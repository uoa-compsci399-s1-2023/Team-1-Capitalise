const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  getUserByName,
  getUserById,
  postUser,
  updateUserDetails,
} = require('../controllers/userController')


router.get('/', getAllUsers);

router.get('/:user', getUserByName);

router.get('/user/:id', getUserById);

router.post('/', postUser);


  




module.exports = router;