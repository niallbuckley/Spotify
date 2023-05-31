var querystring = require('querystring');
var stateKey = 'spotify_auth_state';

const { getRedisClient } = require('./redisConnection');
const client = getRedisClient();


const joinLobbyView = async(req, res) => {
    // checking if the request has cookies, if it does, what it checks for the auth state if it can't find either return null.
    var storedState = req.cookies ? req.cookies[stateKey] : null;
    console.log("Here");
    console.log("WooHoo ", req.query.p, " ", req.query.id);

    var r = await client.exists(storedState);
    if (!r) {
      // if not, send the loginSpotifyController to the user with the same params they used initally. 
      console.log("UNAUTH");
      res.redirect('/#' +
         querystring.stringify({
            error: 'state_mismatch'
         }));
    }
    const data = {
      wss_port: req.query.p,
      wss_id: req.query.id
    };

    res.render("joinLobby", { data })
}

module.exports = joinLobbyView;
