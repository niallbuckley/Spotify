const express = require('express');
const app = express();


// set that all templates are located in `/views` directory
app.set('views', __dirname + '/views');

app.set('view engine', 'ejs');

app.use('/', require('./controllers/loginSpotifyController'));
app.use('/', require('./routes/routes'));


// TODO: clean up
const fs = require('fs');
const path = require('path');

const playlistDatabase = path.join(__dirname, './playlist-database.json');
var stateKey = 'spotify_auth_state';
const bodyParser = require('body-parser');
const updatePlaylist = require('./controllers/update-playlist');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/group-playlist', (req, res)  => {
    // create endpoint /group-playlist/<id>

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
    
    // PUT '/group-playlist/:id'
   updatePlaylist(storedState,playListId);

});

app.put('/group-playlist', (req, res)  => {
    // update endpoint /group-playlist/<id>
    const playListId = req.body.playListId;

    const storedState = req.cookies ? req.cookies[stateKey] : null;

    updatePlaylist(storedState,playListId);
})

/*
app.get('/group-playlist/:id', (req,res) => {
    // this will be set to All the party members once the host presses ready.
    const playListId = req.params.playListId

    // parse through the database and get the number of users get songs based on number of users

    // return playlist

})
*/
const PORT = process.env.PORT || 4111;
app.listen(PORT, console.log("Server listening on port: " + PORT));
