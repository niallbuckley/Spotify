const { getRedisClient } = require('./redisConnection');
const client = getRedisClient();

var getwssId = async(req, res) => {
    user = req.cookies.spotify_auth_state;
    
    var r = await client.exists(user);
    if (!r){
        console.log("Error user not found in database.")
        return
    }

    var wss_data_str = await client.hGet(user, "wss_id");
    wss_data = JSON.parse(wss_data_str);
    const data = { "wss_id" : wss_data.id, "wss_port": wss_data.port};
    
    return res.json(data)
}

module.exports = getwssId;