var querystring = require('querystring');
const fs = require('fs');
const path = require('path');
 
// Define the filepath
const filePath = path.join(__dirname, './../database.json');

var stateKey = 'spotify_auth_state';


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
        res.render("hostLobby", {}); 


        // create a new WebSocket server
        console.log("create a new web socket")
        const WebSocket = require('ws');

        // const wss = new WebSocket.Server({ port: 3000, path: '/id/12345', host: 'localhost', protocol: 'ws' });
        generateIdFile = require('./generateId');
        var randomString = generateIdFile();
        console.log(randomString);
        
        // Save id to database - this only needs to be done for the host
        jsonData[storedState]["wss_id"] = randomString
        
        // Convert the JSON data to a string
        const jsonString = JSON.stringify(jsonData, null, 2);

        // Write the updated data back to the file
        fs.writeFile(filePath, jsonString, 'utf8', (err) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log('The wss id was successfully added to the JSON data.');
        });

        const wss = new WebSocket.Server({ port: 3000, path: '/id/' + randomString, host: 'localhost', protocol: 'ws' });
        
        //const wss = new WebSocket.Server({ port: 3000 });
        
        // keep track of connected clients
        const clients = new Set();
        // keep track of messages sent
        const messageHistory = [];

        // broadcast a message to all clients
        function broadcast(message) {
          for (const client of clients) {
            client.send(message);
          }
        }

        // send message history
        function sendMessageHistory(socket) {
          for (const message of messageHistory) {
            socket.send(message);
          }
        }

        // listen for new WebSocket connections
        wss.on('connection', (socket) => {
          console.log('New client connected');

          // add the new client to the set of connected clients
          clients.add(socket);

          sendMessageHistory(socket);

          // listen for messages from the client
          socket.on('message', (message) => {
            console.log(`Received message: ${message}`);

            // add message to chat history
            messageHistory.push(message);
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
