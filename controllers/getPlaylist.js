const fs = require('fs');
const path = require('path');
const request = require('request');

const playlistDatabase = path.join(__dirname, '.././playlist-database.json');
const userDatabase = path.join(__dirname, '.././database.json');
var stateKey = 'spotify_auth_state';

var getPlaylist = function(req, res)  {
    const playListId = req.params.id;

    console.log("WooHoo: ", playListId);
    fs.readFile(playlistDatabase, 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
        let jsonData = JSON.parse(data);
  
        // Check if the key exists in the JSON data
        if (!(jsonData.hasOwnProperty(playListId))) {
            return res.json({"ERROR": "Playlist ID not found in database"})
        }
        console.log("Users: ", Object.keys(jsonData[playListId]).length);
        const playlist = [];
        // For time being make playlist with only 20 tracks.
        users_in_session =  Object.keys(jsonData[playListId]).length;
        num_songs_per_user = 20/users_in_session;
        // Iterate through the playlist user songs
        for (key in jsonData[playListId]){
            // Iterate through the songs pushing only randomly selected ones
            randomInt = Math.floor(Math.random() * users_in_session);
            for (let i=randomInt; i<20; i=i+users_in_session){
                console.log(jsonData[playListId][key][i]);
                playlist.push(jsonData[playListId][key][i]);
            }
        }
        console.log("Playlist: ", playlist.length);
        
        // create the playlist (hit spotify API)
        const storedState = req.cookies ? req.cookies[stateKey] : null;
        fs.readFile(playlistDatabase, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            let jsonData = JSON.parse(data);
            
            // use the access token to access the Spotify Web API
            var access_token = jsonData[storedState].spot_a_t;
            var options = {
                url: 'https://api.spotify.com/v1/me/top/tracks',
                headers: { 'Authorization': 'Bearer ' + access_token },
                json: true
            };
            request.post(options, function(error, response, body) {
                // create playlist
            });
        })



        // send the playlist to people or host or summin
    })
    return res.json({"getPlaylist": "Testing"});

};

module.exports = getPlaylist;
