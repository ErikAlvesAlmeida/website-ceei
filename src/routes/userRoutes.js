const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, isMaster } = require('../middleware/authMiddleware');

router.patch('/me', verifyToken, userController.updateCurrentUser);
router.delete('/cleanup', verifyToken, isMaster, userController.cleanupAdminUsers);
router.post('/register', verifyToken, isMaster, userController.registerUser);
router.delete('/:id', verifyToken, isMaster, userController.deleteUser);
router.get('/', verifyToken, isMaster, userController.getAllUsers);

module.exports = router;