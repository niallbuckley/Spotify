const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 3000 });

// Create a map to associate paths with WebSocket servers
const servers = new Map();

server.on('connection', (socket, request) => {
  // Extract the path from the request URL
  const path = new URL(request.url, 'http://localhost').pathname;

  // Check if a WebSocket server exists for the path
  if (servers.has(path)) {
    const wsServer = servers.get(path);

    // Handle the connection using the appropriate WebSocket server
    wsServer.onConnection(socket);
  } else {
    // No WebSocket server found for the path, close the connection
    socket.close();
  }
});

// Function to create a new WebSocket server for a specific path
function createWebSocketServer(path) {
  const wsServer = new WebSocket.Server({ noServer: true });

  wsServer.on('connection', (socket) => {
    // Handle the connection for this specific WebSocket server
    // Add your custom logic here
  });

  // Associate the WebSocket server with the path
  servers.set(path, wsServer);

  return wsServer;
}

// Example usage: Create WebSocket servers for different paths
const randomString1 = 'abc123';
const wsServer1 = createWebSocketServer('/id/' + randomString1);

const randomString2 = 'def456';
const wsServer2 = createWebSocketServer('/id/' + randomString2);

