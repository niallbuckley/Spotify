var querystring = require('querystring');
var stateKey = 'spotify_auth_state';

const { getRedisClient } = require('./redisConnection');
const client = getRedisClient();

var client_id = process.env.SPOTIFY_CLIENT_ID; // Your client id
var client_secret = process.env.SPOTIFY_CLIENT_SECRET; // Your secret
var redirect_uri = process.env.SPOTIFY_REDIRECT_URI; // Your redirect uri

const joinLobbyView = async(req, res) => {
    // checking if the request has cookies, if it does, what it checks for the auth state if it can't find either return null.
    var storedState = req.cookies && req.cookies[stateKey] ? req.cookies[stateKey] : "null";
    console.log("stored state: ", storedState);
    if (storedState != "null"){
      client.hSet(storedState, {"test":"test1"});
    }
    var r = await client.exists(storedState);
    if (!r) {
      // if not, send the loginSpotifyController to the user with the same params they used initally. 
      console.log("UNAUTH ", req.url);
      generateRandomString = require('./generateId');
      var state = generateRandomString(16);
      res.cookie(stateKey, state);
      var scope = 'user-read-private user-read-email user-top-read playlist-modify-private playlist-modify-public';
      res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
          response_type: 'code',
          client_id: client_id,
          scope: scope,
          redirect_uri: "http://localhost:4111/join-lobby",
          state: state
        })
      );

    }
    const data = {
      wss_port: req.query.p,
      wss_id: req.query.id
    };

    res.render("joinLobby", { data })
}

module.exports = joinLobbyView;
