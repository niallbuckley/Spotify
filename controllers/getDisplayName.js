var redirect_uri = process.env.SPOTIFY_REDIRECT_URI; // Your redirect uri
var client_id = process.env.SPOTIFY_CLIENT_ID; // Your client id
var client_secret = process.env.SPOTIFY_CLIENT_SECRET; // Your secret

var request = require('request'); // "Request" library

module.exports.displayName = function(code){
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: redirect_uri
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
  
      var access_token = body.access_token;
  
      console.log("access token:  ", access_token);
      var options = {
        url: 'https://api.spotify.com/v1/me',
        headers: { 'Authorization': 'Bearer ' + access_token },
        json: true
      };
      // use the access token to access the Spotify Web API
      request.get(options, function(error, response, body) {
            const display_name = body.display_name;
            console.log("DisNAME: ", display_name);
            return display_name;
        })
    }
    else{  console.log("ERROR ",response.body) }
  })
}

