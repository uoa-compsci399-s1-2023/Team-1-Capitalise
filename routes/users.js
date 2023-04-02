const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  getUserByName,
  getUserById,
  postUser,
  updateUserDetails,
  comparePassWithHash,
  deleteUserById
} = require('../controllers/userController')


router.get('/', getAllUsers);

router.get('/:user', getUserByName);

router.delete('/user/:id', deleteUserById);

router.get('/user/:id', getUserById);

router.patch('/user/:id', updateUserDetails);

router.post('/', postUser);

router.get('/checkPass/:username/:plaintextpass', comparePassWithHash);


  




module.exports = router;