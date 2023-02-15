//js
const express = require('express');
const app = express();
var querystring = require('querystring');
var cookieParser = require('cookie-parser');

var client_id = process.env.SPOTIFY_CLIENT_ID; // Your client id
var client_secret = process.env.SPOTIFY_CLIENT_SECRET; // Your secret
//var redirect_uri = process.env.SPOTIFY_REDIRECT_URI; // Your redirect uri
var redirect_uri = 'http://localhost:4111/mode';

// set that all templates are located in `/views` directory
app.set('views', __dirname + '/views');

app.set('view engine', 'ejs');

app.use('/', require('./routes/login'));
app.use('/', require('./routes/mode'));
app.get('/login-spotify', function(req, res) {
  
  //var state = generateRandomString(16);
  //res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'user-read-private user-read-email user-top-read';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      //state: state
    }));
});

const PORT = process.env.PORT || 4111;
app.listen(PORT, console.log("Server don start for port: " + PORT));
