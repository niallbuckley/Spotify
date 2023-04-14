var querystring = require('querystring');
var stateKey = 'spotify_auth_state';

const { getRedisClient } = require('./redisConnection');
const client = getRedisClient();


const joinLobbyView = async(req, res) => {
    // checking if the request has cookies, if it does, what it checks for the auth state if it can't find either return null.
    var storedState = req.cookies ? req.cookies[stateKey] : null;

    var r = await client.exists(storedState);
    if (!r) {
      console.log("UNAUTH");
      res.redirect('/#' +
         querystring.stringify({
            error: 'state_mismatch'
         }));
    }
    res.render("joinLobby", {})
}

module.exports = joinLobbyView;
