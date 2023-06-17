var querystring = require('querystring');

const retry = require('async-retry');

var stateKey = 'spotify_auth_state';

const { getRedisClient } = require('./redisConnection');
const client = getRedisClient();

async function checkFieldExists(client, storedState) {
  const r = await client.exists(storedState);
  if (r) {
    console.log('Field exists!');
    return true;
  }
  throw new Error('User does not exist!');
}

async function createWebSocketServer(storedState) {
  // create a new WebSocket server
  console.log("create a new web socket")
  const WebSocket = require('ws');

  generateIdFile = require('./generateId');

  var randomString = generateIdFile();

  const new_port = await getAvailablePort();
  console.log("new_port: ", new_port, storedState);
  const wss = new WebSocket.Server({ port: new_port, path: '/id/' + randomString, host: 'localhost', protocol: 'ws' });

  // Write the wss to database
  wss_data = {"id": randomString, "port": new_port}
  await client.hSet(storedState, "wss_id", JSON.stringify(wss_data));

  var wss_data = await client.hGet(storedState, "wss_id");

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

  async function getAvailablePort() {
    const server = new WebSocket.Server({ port: 0 }); // Pass 0 to let the OS assign an available port
    await new Promise((resolve) => server.once('listening', resolve));
    const port = server.address().port;
    server.close();
    return port;
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

const hostLobbyView = async(req, res) => {
    // checking if the request has cookies, if it does, what it checks for the auth state if it can't find either return null.
    var storedState = req.cookies ? req.cookies[stateKey] : null;
    console.log("HEERRREEEE1 " , storedState);

    try {
      const exists = await retry(async () => {
        return await checkFieldExists(client, storedState);
      }, {
        retries: 3,
        minTimeout: 1000,
        onRetry: (err, attempt) => {
          console.log(`Retrying (${attempt}/${3})...`);
        },
      });

      // If user is authorized to enter this page
      if (exists) {
        
        var r = await client.hExists(storedState, "wss_id");
        
        if (!r) {
          createWebSocketServer(storedState);
          // This is looking at views diretory
          res.render("hostLobby", {}); 
        }
        else{
          console.log("This user already created a host session!");
          // add logic to reconnect you to old host session. 
        }
     } 
     else {
        console.log("This shouldn't ever get hit!!!!!");
      }
    } catch (error) {
      // User doesn't exist. Handle it accordingly
      console.log(`Max retries exceeded. Unable to perform the operation. Error: ${error.message}`);
      console.log("UNAUTH");
      res.redirect('/#' +
            querystring.stringify({
              error: 'state_mismatch'
            })
        );
    }
}

module.exports = hostLobbyView;
