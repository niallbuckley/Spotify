var stateKey = 'spotify_auth_state';

const updatePlaylist = require('./update-playlist');



var updateJoinPlaylist = function(req, res)  { 
    const playListId = req.body.playListId;

    const storedState = req.cookies ? req.cookies[stateKey] : null;

    updatePlaylist(storedState,playListId);
    return true;
};

module.exports= updateJoinPlaylist;
