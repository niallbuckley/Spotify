var querystring = require('querystring');
var stateKey = 'spotify_auth_state';
const fs = require('fs');
const path = require('path');
 
// Define the filepath
const filePath = path.join(__dirname, './../database.json');


const hostLobbyView = (req, res) => {
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
        res.render("hostLobby", {
        }); 
        // serve the static files from the 'public' directory
        //app.use(express.static('public'));

        // create a new WebSocket server
        const WebSocket = require('ws');
        const wss = new WebSocket.Server({ port: 3000 });
        console.log("web socket set up on server")

        // keep track of connected clients
        const clients = new Set();

        // broadcast a message to all clients
        function broadcast(message) {
          for (const client of clients) {
            client.send(message);
          }
        }

        // listen for new WebSocket connections
        wss.on('connection', (socket) => {
          console.log('New client connected');

          // add the new client to the set of connected clients
          clients.add(socket);

          // listen for messages from the client
          socket.on('message', (message) => {
            console.log(`Received message: ${message}`);

            // broadcast the message to all clients
            broadcast(message);
          });

          // listen for the socket to close
          socket.on('close', () => {
            console.log('Client disconnected');

            // remove the client from the set of connected clients
            clients.delete(socket);
          });
        });
      }
    });
}

module.exports = hostLobbyView;
