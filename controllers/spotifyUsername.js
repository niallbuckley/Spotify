
const express = require('express');
const app = express();

const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '.././database.json');

var getUserSpotifyUserName = function(req, res)  {
    console.log('called1!')
    user = req.cookies.spotify_auth_state;
    console.log('called2!')
    // Read the existing data from the database
    // Sometimes this line is erroring out.
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log('called3!')
        let jsonData = JSON.parse(data);
  
        // Check if the key exists in the JSON data
        if (jsonData.hasOwnProperty(user)) {
            console.log('called4!')
            const data = { user_name : jsonData[user]["spot_user_name"]};
            return res.json(data)
        }
        else{
            console.log("Error user not found in database.")
        }
    })
};

module.exports = getUserSpotifyUserName;