var stateKey = 'spotify_auth_state';

const { getRedisClient } = require('./redisConnection');
const client = getRedisClient();

var checkUserExists = async(req, res) => {
    const storedState = req.cookies ? req.cookies[stateKey] : null;
    const playListId = req.params.playlist;
    console.log("check Dup: ", playListId, storedState);

    e = await client.hExists(playListId, storedState);
    
    if (e){
        return res.json({"userExists": "true"});
    }
    
    return res.json({"userExists": "false"});
};

module.exports= checkUserExists;


