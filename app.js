const express = require('express');
const app = express();


// set that all templates are located in `/views` directory
app.set('views', __dirname + '/views');

app.set('view engine', 'ejs');

app.use('/', require('./controllers/loginSpotifyController'));
app.use('/', require('./routes/routes'));


app.post('/group-playlist', (req, res)  => {
    // create endpoint /group-playlist/<id>
    const playListId = req.body.playListId
    // create instance in playlist database with { playListId : None } to start.
})

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

const PORT = process.env.PORT || 4111;
app.listen(PORT, console.log("Server listening on port: " + PORT));
