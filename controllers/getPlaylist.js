const fs = require('fs');
const path = require('path');

const playlistDatabase = path.join(__dirname, '.././playlist-database.json');
var stateKey = 'spotify_auth_state';

var getPlaylist = function(req, res)  {
    const playListId = req.params.playListId;

    console.log("WooHoo: ", playListId);
    return {"playlist": "Test"};

};

module.exports = getPlaylist;
