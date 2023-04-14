// TODO: clean up this is NOT actually creating the playlist database!
var stateKey = 'spotify_auth_state';

const updatePlaylist = require('./update-playlist');

const { getRedisClient } = require('./redisConnection');
const client = getRedisClient();


var createHostPlaylist = async(req, res) => {
    // create endpoint /group-playlist/<id>
    console.log("playlist id? ", req.body.playListId);
    const playListId = req.body.playListId;
    const storedState = req.cookies ? req.cookies[stateKey] : null;

    //await client.hSet(playListId, {}, "");

    updatePlaylist(storedState,playListId);

    // This is done in parallel with the create playlist --> possibly an issue!
    return res.json({"data": "Testing"});
};

module.exports = createHostPlaylist;
