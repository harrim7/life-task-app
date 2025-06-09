const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// Auth routes
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/verify', auth, userController.getUser);

module.exports = router;