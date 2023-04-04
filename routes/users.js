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

router.get('/:username', getUserByName);

router.delete('/user/:id', deleteUserById);

router.get('/user/:id', getUserById);

router.patch('/user/:id', updateUserDetails);

router.post('/', postUser);

router.get('/:username/:plaintextpass', comparePassWithHash);


  




module.exports = router;