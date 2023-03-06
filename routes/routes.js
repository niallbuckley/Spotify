const express = require('express');
const router = express.Router();
const app = express();


const modeChoiceView = require('../controllers/modeController');
router.get('/mode', modeChoiceView);
module.exports = router;

const hostLobbyView = require('../controllers/hostLobbyController');
router.get('/host-lobby', hostLobbyView);
module.exports = router;

const joinLobbyView = require('../controllers/joinLobbyController');
router.get('/join-lobby', joinLobbyView);
module.exports = router;

const getUserSpotifyUserName = require('../controllers/spotifyUsername');
router.get('/spotify-username', function(req, res){ getUserSpotifyUserName(req, res); });
module.exports = router;

const getwssId = require('../controllers/wssId');
router.get('/web-socket-server-id', function(req, res){ getwssId(req,res); });
module.exports = router;