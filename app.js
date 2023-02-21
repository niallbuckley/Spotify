const express = require('express');
const app = express();

// set that all templates are located in `/views` directory
app.set('views', __dirname + '/views');

app.set('view engine', 'ejs');

app.use('/', require('./routes/login'));
app.use('/', require('./controllers/loginSpotifyController'));
app.use('/', require('./routes/mode'));
app.use('/', require('./routes/host-lobby'));
app.use('/', require('./routes/join-lobby'));

const PORT = process.env.PORT || 4111;
app.listen(PORT, console.log("Server listening on port: " + PORT));
