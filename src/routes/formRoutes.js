// src/routes/formRoutes.js
const express = require('express');
const router = express.Router();
const formController = require('../controllers/formController');

router.post('/send-email', formController.sendContactEmail);

module.exports = router;