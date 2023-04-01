const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  getUserByName,
  getUserById,
  postUser,
  updateUserDetails,
  comparePassWithHash,
} = require('../controllers/userController')


router.get('/', getAllUsers);

router.get('/:user', getUserByName);

router.get('/user/:id', getUserById);

router.post('/', postUser);

router.get('/checkPass/:username/:plaintextpass', comparePassWithHash);


  




module.exports = router;