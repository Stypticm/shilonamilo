const express = require('express');
const lotController = require('../controllers/lotController');

const router = express.Router();

router.get('/', lotController.getAllLots);

module.exports = router;