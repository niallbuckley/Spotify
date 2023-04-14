const request = require('request');
const lodash = require('lodash');


const { getRedisClient } = require('./redisConnection');
const client = getRedisClient();


var stateKey = 'spotify_auth_state';

var getPlaylist = async(req, res) => {
    const playListId = req.params.id;
    r = await client.exists(playListId);
    if (!r){
        return res.json({"ERROR": "Playlist ID not found in database"});
    }
    users_in_session = await client.hLen(playListId);
    console.log("Number of users: ", users_in_session);

    var playlist = [];

    // For time being make playlist with only 20 tracks.
    num_songs_per_user = 20/users_in_session;

    user_keys = await client.hKeys(playListId);
    console.log(user_keys);
    // Iterate through the playlist user songs
    for (var user of user_keys){
        // Iterate through the songs pushing only randomly selected ones
        console.log(user);
        user_songs = await client.hGet(playListId, user);
        user_songs = JSON.parse(user_songs);
        randomInt = Math.floor(Math.random() * users_in_session);
        for (let i=randomInt; i<20; i=i+users_in_session){
            console.log(user_songs[i]);
            playlist.push(user_songs[i]);
        }
    }
            
    // use the access token to access the Spotify Web API
    var access_token = await client.hGet(user, "spot_a_t");
    var user_id = await client.hGet(user, "spot_id");
    const now = new Date();
    
    var myBody = {
        "name": "Playlist Deli " + now.toISOString(),
        "description": "New playlist description",
        "public": true
    };
    var options = {
        url: 'https://api.spotify.com/v1/users/' + user_id + '/playlists',
        headers: { 'Authorization': 'Bearer ' + access_token },
        json: true,
        body: myBody
    };
    playlist = lodash.shuffle(playlist);
    // create playlist
    request.post(options, function(error, response, body) {
        if (error) {
            console.error(error);
            
        } 
        console.log(body.id);
        var options = {
            url: 'https://api.spotify.com/v1/playlists/' + body.id + '/tracks',
            headers: { 'Authorization': 'Bearer ' + access_token },
            json: true,
            body: playlist
        };
        // post the songs to the created playlist.
        request.post(options, function(error, response, body) {
            if (error) {
                console.error(error);
                
            } 
            
        })
    });
    return res.json({"getPlaylist": "Testing"});

};


module.exports = getPlaylist;
