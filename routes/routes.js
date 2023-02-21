const express = require('express');
const router = express.Router();


const modeChoiceView = require('../controllers/modeController');
router.get('/mode', modeChoiceView);
module.exports = router;

const hostLobbyView = require('../controllers/hostLobbyController');
router.get('/host-lobby', hostLobbyView);
module.exports = router;

const joinLobbyView = require('../controllers/joinLobbyController');
router.get('/join-lobby', joinLobbyView);
module.exports = router;
