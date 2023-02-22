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
        const WebSocket = require("ws");
        const WebSocketServer = WebSocket.Server;

        const server = new WebSocketServer({ port: 3000 });

        console.log("Socket Server started");

        server.on("connection", (socket) => {
          // send a message to the client
          socket.send(JSON.stringify({
            type: "hello from server",
            content: [ 1, "2" ]
          }));

          // receive a message from the client
          socket.on("message", (data) => {
            const packet = JSON.parse(data);

            switch (packet.type) {
              case "hello from client":
                // ...
                console.log("Server: message received from client")
                //document.getElementById("messages").innerHTML = "Client Joined";
                break;
            }
          });
        });
      }
    });
}

module.exports = hostLobbyView;
