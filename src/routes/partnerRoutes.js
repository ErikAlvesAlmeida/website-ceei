const express = require('express');
const router = express.Router();
const partnerController = require('../controllers/partnerController');
const { verifyToken } = require('../middleware/authMiddleware');
const { partnerUpload } = require('../middleware/uploadMiddleware');

router.get('/', partnerController.getAllPartners);
router.post('/', verifyToken, partnerUpload.single('image'), partnerController.createPartner);
router.delete('/:id', verifyToken, partnerController.deletePartner);

module.exports = router;