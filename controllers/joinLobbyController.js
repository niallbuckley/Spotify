var querystring = require('querystring');
var stateKey = 'spotify_auth_state';

const { getRedisClient } = require('./redisConnection');
const client = getRedisClient();

var client_id = process.env.SPOTIFY_CLIENT_ID; // Your client id
var client_secret = process.env.SPOTIFY_CLIENT_SECRET; // Your secret
var redirect_uri = process.env.SPOTIFY_REDIRECT_URI; // Your redirect uri

const setUpUser = require('./setupUserInApp');

const joinLobbyView = async(req, res) => {
    // checking if the request has cookies, if it does, what it checks for the auth state if it can't find either return null.
    var storedState = req.cookies && req.cookies[stateKey] ? req.cookies[stateKey] : "null";
    var code = req.query.code || null;
    
    
    var r = await client.exists(storedState);
    if (storedState == "null") {
      // if not, send the loginSpotifyController to the user with the same params they used initally. 
      console.log("UNAUTH " + req.url);
      generateRandomString = require('./generateId');
      var state = generateRandomString(16);
      res.cookie(stateKey, state);
      if (req.query.p && req.query.id){
        res.cookie("wss_port", req.query.p);
        res.cookie("wss_id", req.query.id);
      }
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
    else{
      // When user logs in the query should be seen to above the cookie. If no param use cookie
      var r = await client.exists(storedState);
      if (!r){
        // If user doesn't exist, Add to database
        //start promise here
        setUpUser(code, storedState, "http://localhost:4111/join-lobby");

      }

      const data = {};
      if (req.query.p && req.query.id){
        data["wss_port"] = req.query.p;
        data["wss_id"] = req.query.id;
      }
      else if (req.cookies["wss_port"] && req.cookies["wss_port"]){
        data["wss_port"] = req.cookies["wss_port"]
        data["wss_id"] = req.cookies["wss_id"]
      }
      // only serve if promise has completed.
      res.render("joinLobby", { data })
  }
}

module.exports = joinLobbyView;
