const express = require('express');
const joinLobbyView = require('../controllers/joinLobbyController');
const router = express.Router();

router.get('/join-lobby', joinLobbyView);
module.exports = router;