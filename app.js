const express = require('express');
const app = express();

const bodyParser = require('body-parser');

// set all templates location to `/views` directory
app.set('views', __dirname + '/views');

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', require('./controllers/loginSpotifyController'));
app.use('/', require('./routes/routes'));


const PORT = process.env.PORT || 4111;
app.listen(PORT, console.log("Server listening on port: " + PORT));
