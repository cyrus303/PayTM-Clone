const express = require('express');
const router = express.Router();
const authenticateUser = require('../Middleware/authenticateUser');
const userController = require('../Controllers/userController');

router.post('/signup', userController.userSignUp);
router.post('/signin', userController.userSignIn);
router.put('/', authenticateUser, userController.updateUserDetails);
router.get('/bulk', userController.findUsers);

module.exports = router;
