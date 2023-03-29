const fs = require('fs');
const path = require('path');
const redis = require('redis');

var querystring = require('querystring');
var stateKey = 'spotify_auth_state';

var redirect_uri = process.env.SPOTIFY_REDIRECT_URI; // Your redirect uri
var client_id = process.env.SPOTIFY_CLIENT_ID; // Your client id
var client_secret = process.env.SPOTIFY_CLIENT_SECRET; // Your secret

var request = require('request'); // "Request" library

// Define file path to database
const filePath = path.join(__dirname, './../database.json');

const modeChoiceView = (req, res) => {
    console.time();
    var code = req.query.code || null;
    var state = req.query.state || null;
    var stateInDatabase = false;
    // checking if the request has cookies, if it does, what it checks for the auth state if it can't find either return null.
    var storedState = req.cookies ? req.cookies[stateKey] : null;


    // Read the existing data from the database
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }

      let jsonData = JSON.parse(data);

      // Check if the key exists in the JSON data
      if (jsonData.hasOwnProperty(storedState)) {
        stateInDatabase = true;
      }

      if ((state === null || state !== storedState) === true && stateInDatabase === false) {
        console.log("REDIRECT");
        res.redirect('/#' +
           querystring.stringify({
              error: 'state_mismatch'
           }));
      }
      else {
        // create a Redis client with existing instance details
        const client = redis.createClient({
          host: '127.0.0.1',
          port: '6379'
        });
        client.connect();
        client.on('error', err => console.log('Redis Client Error', err));
        client.on('connect', () => {
          console.log('Connected!');
          client.set('mykey', 'myvalue', (err, result) => {
            console.log("hereeee");
            if (err) {
              console.error(err);
            } else {
              console.log('Set result:', result);
              client.get('mykey', (err, result) => {
                if (err) {
                  console.error(err);
                } else {
                  console.log('Get result:', result);
                  client.quit();
                }
              });
            }
          });
        });
        // set a key-value pair
        console.log("executed first!")
  
        // Check if the key exists in the JSON data
        if (jsonData.hasOwnProperty(state)) {
          console.log('The key already exists in the JSON data.');
        }
        else{
          // If the key does not exist, add it to the database Along with spotify display name
          
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
                    // Store auth cookie with the spotify display name in the database
                    // This is the first instance in the data base the state has not been added yet --> maybe to do add state before this point
                    jsonData[state] = { "spot_user_name" : body.display_name }
                    jsonData[state]["spot_a_t"] = access_token;
                    jsonData[state]["spot_id"] = body.id;

                    
                    // Convert the JSON data to a string
                    const jsonString = JSON.stringify(jsonData, null, 2);

                    // Write the updated data back to the file
                    fs.writeFile(filePath, jsonString, 'utf8', (err) => {
                      if (err) {
                        console.error(err);
                        return;
                      }
                      console.timeEnd();
                      console.log('The spotify username was successfully added to the JSON data.P');
                    });
                })
            }
            else{  console.log("ERROR ",response.body) }
          })
        }
        // This is looking at views diretory 
        res.render("mode", {
        }); 
      }
    });
}

module.exports = modeChoiceView;
