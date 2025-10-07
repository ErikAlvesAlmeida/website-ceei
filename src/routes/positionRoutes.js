const express = require('express');
const router = express.Router();
const positionController = require('../controllers/positionController');
const { verifyToken } = require('../middleware/authMiddleware');
const { positionUpload } = require('../middleware/uploadMiddleware');

// Rotas públicas (se houver, como a de listagem)
router.get('/', positionController.getAllPositions);

// Rotas protegidas (requerem token)
router.post('/', verifyToken, positionUpload.single('image'), positionController.createPosition);
router.patch('/:id', verifyToken, positionUpload.single('image'), positionController.updatePosition);
router.delete('/:id', verifyToken, positionController.deletePosition);

module.exports = router;