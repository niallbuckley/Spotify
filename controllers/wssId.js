const { getRedisClient } = require('./redisConnection');
const client = getRedisClient();

var getwssId = async(req, res) => {
    user = req.cookies.spotify_auth_state;
    
    var r = await client.exists(user);
    if (!r){
        console.log("Error user not found in database.")
        return
    }

    var wss_id = await client.hGet(user, "wss_id");

    const data = { "wss_id" : wss_id};
    
    return res.json(data)
}

module.exports = getwssId;