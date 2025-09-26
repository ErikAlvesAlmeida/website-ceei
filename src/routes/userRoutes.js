const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, isMaster } = require('../middleware/authMiddleware');

// A rota de registro é protegida, exigindo um token válido de um usuário MASTER
router.post('/register', verifyToken, isMaster, userController.registerUser);

module.exports = router;