const express = require('express');
const app = express();

const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, './database.json');

// set that all templates are located in `/views` directory
app.set('views', __dirname + '/views');

app.set('view engine', 'ejs');

app.use('/', require('./routes/login'));
app.use('/', require('./controllers/loginSpotifyController'));
app.use('/', require('./routes/routes'));

// TODO: Add this to the controllers
app.get('/spotify-username', (req, res) =>  {
    user = req.cookies.spotify_auth_state;
    // Read the existing data from the database
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
  
        let jsonData = JSON.parse(data);
  
        // Check if the key exists in the JSON data
        if (jsonData.hasOwnProperty(user)) {
            const data = { user_name : jsonData[user]};
            res.json(data)
        }
        else{
            console.log("Error user not found in database.")
        }
    })

})

const PORT = process.env.PORT || 4111;
app.listen(PORT, console.log("Server listening on port: " + PORT));
