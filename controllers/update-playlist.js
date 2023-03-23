// PUT Upate the playlist with the users songs
const fs = require('fs');
const path = require('path');
const request = require('request'); 

const playlistDatabase = path.join(__dirname, '.././playlist-database.json');
const userDatabase = path.join(__dirname, '.././database.json');

var updatePlaylist = function(userState, playListId){
    console.log("Update called  1");
    // Also this line
    fs.readFile(userDatabase, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log("Update called  2");
            let jsonData = JSON.parse(data);
            
            // use the access token to access the Spotify Web API
            console.log("Update called  3");
            var access_token = jsonData[userState].spot_a_t;
            var options = {
                url: 'https://api.spotify.com/v1/me/top/tracks',
                headers: { 'Authorization': 'Bearer ' + access_token },
                json: true
            };
            console.log("Update called  4");
            fs.readFile(playlistDatabase, 'utf8', (err, data) => {
                console.log("Update called  5");
                if (err) {
                console.error(err);
                return;
                }
                let playlistJsonData = JSON.parse(data);
                
                // GET request to spotify to get the users top tracks
                request.get(options, function(error, response, body) {

                    // Refresh user tracks even if they already exist in database
                    
                    if (!( userState in playlistJsonData[playListId])) {
                        playlistJsonData[playListId][userState] = []
                    }

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