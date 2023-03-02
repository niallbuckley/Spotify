const express = require('express');
const app = express();

// set that all templates are located in `/views` directory
app.set('views', __dirname + '/views');

app.set('view engine', 'ejs');

app.use('/', require('./routes/login'));
app.use('/', require('./controllers/loginSpotifyController'));
app.use('/', require('./routes/routes'));

app.get('/spotify-username', (req, res) =>  {
    console.log('HHHEEELLLOOO   ', req.cookies.spotify_auth_state);
    user = req.cookies.spotify_auth_state;
    res.send("Hello Client");

})

const PORT = process.env.PORT || 4111;
app.listen(PORT, console.log("Server listening on port: " + PORT));
