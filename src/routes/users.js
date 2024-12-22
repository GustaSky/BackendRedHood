const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Rotas públicas
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/verify-pin', userController.verifyPin);
router.post('/reset-password', userController.resetPassword);

module.exports = router; 