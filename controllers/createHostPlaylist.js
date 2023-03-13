// TODO: clean up
const fs = require('fs');
const path = require('path');

const playlistDatabase = path.join(__dirname, '.././playlist-database.json');
var stateKey = 'spotify_auth_state';
const bodyParser = require('body-parser');
const updatePlaylist = require('./update-playlist');

//app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser.json());

var createHostPlaylist = function(req, res)  { 
    // create endpoint /group-playlist/<id>
    console.log("Hello? ", req.body.playListId);
    const playListId = req.body.playListId;

    const storedState = req.cookies ? req.cookies[stateKey] : null;
    // create instance in playlist database with { playListId : None } to start.
    fs.readFile(playlistDatabase, 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
        let jsonData = JSON.parse(data);

        jsonData[playListId] = {}
        const jsonString = JSON.stringify(jsonData, null, 2);

        // Write the updated data back to the file
        fs.writeFile(playlistDatabase, jsonString, 'utf8', (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('Playlist instance was stored in database');
        });
    });
    // PUT '/group-playlist Body:id'
    updatePlaylist(storedState,playListId);
};

module.exports = createHostPlaylist;
