const express = require('express');
const router = express.Router();
const {auth} = require('../middleware/auth');
const admin = require('../middleware/admin');

const {
  getAllUsers,
  getUserById,
  postUser,
  updateUserDetails,
  deleteUserById,
  getCurrentUser,
  adminDeleteUserById,
  adminUpdateUserDetails,
  searchUsers,
  getUserComments
} = require('../controllers/userController')


router.get('/', getAllUsers);

router.get('/search', searchUsers);

router.delete('/user/:id', auth, deleteUserById);

router.get('/user/:id', getUserById);

router.patch('/user/:id', auth, updateUserDetails);

router.post('/', postUser);

router.get('/getCurrentUser/me', auth, getCurrentUser);

router.get('/myComments/:id', getUserComments)

router.delete('/admin/:id', [auth, admin], adminDeleteUserById);
router.patch('/admin/:id', [auth, admin], adminUpdateUserDetails);



module.exports = router;