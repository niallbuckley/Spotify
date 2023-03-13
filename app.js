const express = require('express');
const app = express();

const bodyParser = require('body-parser');

// set that all templates are located in `/views` directory
app.set('views', __dirname + '/views');

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', require('./controllers/loginSpotifyController'));
app.use('/', require('./routes/routes'));


app.put('/group-playlist', (req, res)  => {
    // update endpoint /group-playlist Body:id
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
