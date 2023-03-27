const fs = require('fs');
const path = require('path');
const request = require('request');
const lodash = require('lodash');

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
        var playlist = [];
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
        fs.readFile(userDatabase, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            let userJsonData = JSON.parse(data);
            
            // use the access token to access the Spotify Web API
            var access_token = userJsonData[storedState].spot_a_t;
            var user_id = userJsonData[storedState].spot_id;
            console.log (user_id, access_token);
            var myBody = {
                "name": "Playlist Deli",
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
        })
    })
    return res.json({"getPlaylist": "Testing"});

};

module.exports = getPlaylist;
