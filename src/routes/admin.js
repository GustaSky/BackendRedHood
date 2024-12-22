const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middlewares/auth');
const adminAuth = require('../middlewares/adminAuth');

// Todas as rotas precisam de autenticação e privilégios de admin
router.use(auth, adminAuth);

router.get('/users', adminController.listUsers);
router.put('/users/:userId/make-admin', adminController.makeAdmin);
router.put('/users/:userId/remove-admin', adminController.removeAdmin);

module.exports = router; 