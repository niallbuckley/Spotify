var querystring = require('querystring');
var stateKey = 'spotify_auth_state';
const fs = require('fs');
const path = require('path');
 
// Define the filepath
const filePath = path.join(__dirname, './../database.json');


const joinLobbyView = (req, res) => {
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
        console.log("state in database.")
        stateInDatabase = true;
      }

      if (stateInDatabase === false) {
        console.log("UNAUTH");
        res.redirect('/#' +
           querystring.stringify({
              error: 'state_mismatch'
           }));
      }
      else {
        // This is looking at views diretory 
        res.render("joinLobby", {
        }); 
      }
    });
}

module.exports = joinLobbyView;
