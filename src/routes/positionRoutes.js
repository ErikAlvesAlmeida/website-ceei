const express = require('express');
const router = express.Router();
const positionController = require('../controllers/positionController');
const { verifyToken } = require('../middleware/authMiddleware');
const { positionUpload } = require('../middleware/uploadMiddleware');

router.get('/', positionController.getAllPositions);
router.post('/', verifyToken, positionUpload.single('image'), positionController.createPosition);
router.delete('/:id', verifyToken, positionController.deletePosition);

module.exports = router;