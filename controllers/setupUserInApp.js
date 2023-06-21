
var redirect_uri = process.env.SPOTIFY_REDIRECT_URI; // Your redirect uri
var client_id = process.env.SPOTIFY_CLIENT_ID; // Your client id
var client_secret = process.env.SPOTIFY_CLIENT_SECRET; // Your secret

var request = require('request'); // "Request" library

// database
const redis = require('redis');

//database
const { getRedisClient } = require('./redisConnection');
const client = getRedisClient();

function authenticatApplication(code, state){
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

          var options = {
            url: 'https://api.spotify.com/v1/me',
            headers: { 'Authorization': 'Bearer ' + access_token },
            json: true
          };
          // use the access token to access the Spotify Web API
          request.get(options, function(error, response, body) {
                // spotify id, spotify display name, and spotify access token in the database
                jData = {"spot_user_name": body.display_name, "spot_a_t": access_token, "spot_id": body.id };
                console.log("SS: ", state);
                client.hSet(state, jData);
                console.timeEnd();
            })
        }
        else{  console.log("ERROR ",response.body) }
      })
    }
  
module.exports = authenticatApplication;