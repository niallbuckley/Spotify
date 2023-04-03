const express = require('express');
const router = express.Router();

const loginView = require('../controllers/loginController');
const modeChoiceView = require('../controllers/modeControllerRedis');
const hostLobbyView = require('../controllers/hostLobbyControllerRedis');
const joinLobbyView = require('../controllers/joinLobbyController');
const getUserSpotifyUserName = require('../controllers/spotifyUsername');
const getwssId = require('../controllers/wssId');
const createHostPlaylist = require('../controllers/createHostPlaylist');
const updateJoinPlaylist = require('../controllers/updateJoinPlaylist');
const getPlaylist = require('../controllers/getPlaylist');

// Web Pages
router.get('/login', loginView);
router.get('/mode', modeChoiceView);
router.get('/host-lobby', hostLobbyView);
router.get('/join-lobby', joinLobbyView);

// API's
router.get('/spotify-username', function(req, res){ getUserSpotifyUserName(req, res); });
router.get('/web-socket-server-id', function(req, res){ getwssId(req,res); });
router.post('/group-playlist', function(req, res)  { createHostPlaylist(req,res); });
router.put('/group-playlist', function(req, res)  { updateJoinPlaylist(req,res); });
router.get('/group-playlist/:id', function(req,res) { getPlaylist(req,res); });

module.exports = router;
