const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const authMiddleware = require('../middleware/authMiddleware');

// router.get('/home', authMiddleware, UserController.getProfile);
// router.put('/', authMiddleware, UserController.updateProfile);

module.exports = router;
