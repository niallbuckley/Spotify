const express = require('express');
const modeChoiceView = require('../controllers/modeController');
const router = express.Router();

router.get('/mode', modeChoiceView);
module.exports = router;
