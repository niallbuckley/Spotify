const express = require('express');
const app = express();


// set that all templates are located in `/views` directory
app.set('views', __dirname + '/views');

app.set('view engine', 'ejs');

app.use('/', require('./controllers/loginSpotifyController'));
app.use('/', require('./routes/routes'));

const fs = require('fs');
const path = require('path');
const request = require('request'); 

const playlistDatabase = path.join(__dirname, './playlist-database.json');
const userDatabase = path.join(__dirname, './database.json');
var stateKey = 'spotify_auth_state';
const bodyParser = require('body-parser');

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
        jsonData[playListId] =  { [storedState]: [] }
        const jsonString = JSON.stringify(jsonData, null, 2);

        // Write the updated data back to the file
        fs.writeFile(playlistDatabase, jsonString, 'utf8', (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('Playlist was stored in database');
        });
    });
    fs.readFile(userDatabase, 'utf8', (err, data) => {
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

        // make GET request to spotify to get the users top artists
        request.get(options, function(error, response, body) {
            console.log(body.items[0].uri);
            for (let i=0; i<body.items.length; i++){
                console.log(body.items[i].uri);
            }

            const jsonString = JSON.stringify(jsonData, null, 2);

        });
        
    });
});
/*
app.put('/group-playlist/:id', (req, res)  => {
    // update endpoint /group-playlist/<id>
    const { playListId, userState } = req.body

    // Open user database and get access token
    
    // Fetch spotify for most popular songs
    
    // Add users most popular songs to playlist database like this: {playListId : {userState : [song list] }}
})

app.get('/group-playlist/:id', (req,res) => {
    // this will be set to All the party members once the host presses ready.
    const playListId = req.params.playListId

    // parse through the database and get the number of users get songs based on number of users

    // return playlist

})
*/
const PORT = process.env.PORT || 4111;
app.listen(PORT, console.log("Server listening on port: " + PORT));
