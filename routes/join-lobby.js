const express = require('express');
const hostLobbyView = require('../controllers/hostLobbyController');
const router = express.Router();

router.get('/host-lobby', hostLobbyView);
module.exports = router;