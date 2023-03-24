const fs = require('fs');
const path = require('path');

const playlistDatabase = path.join(__dirname, '.././playlist-database.json');
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
        // iterate through the playlist user songs
        for (key in jsonData[playListId]){
            // iterate through the songs pushing only randomly selected ones
            randomInt = Math.floor(Math.random() * users_in_session);
            for (let i=randomInt; i<20; i=i+users_in_session){
                console.log(jsonData[playListId][key][i]);
                playlist.push(jsonData[playListId][key][i]);
            }
        }
        console.log("Playlist: ", playlist.length);
    })
    return res.json({"getPlaylist": "Testing"});

};

module.exports = getPlaylist;
