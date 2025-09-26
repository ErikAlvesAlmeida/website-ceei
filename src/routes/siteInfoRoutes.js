const express = require('express');
const router = express.Router();
const siteInfoController = require('../controllers/siteInfoController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', siteInfoController.getSiteInfo);
router.patch('/', verifyToken, siteInfoController.updateSiteInfo);

module.exports = router;