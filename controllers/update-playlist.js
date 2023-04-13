// PUT Upate the playlist with the users songs
const request = require('request'); 

const { getRedisClient } = require('./redisConnection');
const client = getRedisClient();

var updatePlaylist = async(userState, playListId) => {    
    
    var r = await client.exists(userState);
    if (!r){
        console.log("Error user not found in database.")
        return
    }
    // use the access token to access the Spotify Web API
    var access_token = await client.hGet(user, "spot_a_t");

    var options = {
        url: 'https://api.spotify.com/v1/me/top/tracks',
        headers: { 'Authorization': 'Bearer ' + access_token },
        json: true
    };
    request.get(options, function(error, response, body) {
    
        user_song_arr = []
        for (let i=0; i<body.items.length; i++){
            user_song_arr.push(body.items[i].uri);
        }
        user_song_json_str = JSON.stringify(user_song_arr);
        client.hSet(playListId, userState, user_song_json_str);
        return;

    });
}
module.exports = updatePlaylist;