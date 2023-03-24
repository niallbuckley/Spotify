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
        // For time being make playlist with only 20 tracks.
        users_in_session =  Object.keys(jsonData[playListId]).length;
    })
    return res.json({"getPlaylist": "Testing"});

};

module.exports = getPlaylist;
