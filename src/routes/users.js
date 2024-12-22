const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');

// Rotas públicas
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/verify-pin', userController.verifyPin);
router.post('/reset-password', userController.resetPassword);

// Rotas protegidas
router.put('/profile', auth, userController.update);

module.exports = router; 