// PUT Upate the playlist with the users songs
const fs = require('fs');
const path = require('path');
const request = require('request'); 

const playlistDatabase = path.join(__dirname, '.././playlist-database.json');
const userDatabase = path.join(__dirname, '.././database.json');

var updatePlaylist = function(userState, playListId){
    fs.readFile(userDatabase, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            let jsonData = JSON.parse(data);
            
            // use the access token to access the Spotify Web API
            var access_token = jsonData[userState].spot_a_t;
            var options = {
                url: 'https://api.spotify.com/v1/me/top/tracks',
                headers: { 'Authorization': 'Bearer ' + access_token },
                json: true
            };
            fs.readFile(playlistDatabase, 'utf8', (err, data) => {
                if (err) {
                console.error(err);
                return;
                }
                let playlistJsonData = JSON.parse(data);
                
                // GET request to spotify to get the users top tracks
                request.get(options, function(error, response, body) {

                    playlistJsonData[playListId][userState] = []

                    for (let i=0; i<body.items.length; i++){
                        playlistJsonData[playListId][userState].push(body.items[i].uri);
                    }

                    const jsonString = JSON.stringify(playlistJsonData, null, 2);

                    // Write the updated data back to the file
                    fs.writeFile(playlistDatabase, jsonString, 'utf8', (err) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    console.log('Playlist: user songs were stored in database');
                    });
                });
            });
    });

}
module.exports = updatePlaylist;