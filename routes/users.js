const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const {
  getAllUsers,
  getUserByName,
  getUserById,
  postUser,
  updateUserDetails,
  deleteUserById,
  getCurrentUser,
} = require('../controllers/userController')


router.get('/', getAllUsers);

router.get('/:username', getUserByName);

router.delete('/user/:id', auth, deleteUserById);

router.get('/user/:id', getUserById);

router.patch('/user/:id', auth, updateUserDetails);

router.post('/', postUser);

router.get('/getCurrentUser/me', auth, getCurrentUser);


  




module.exports = router;