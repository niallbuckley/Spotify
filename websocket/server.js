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
        document.getElementById("messages").innerHTML = "Client Joined";
        break;
    }
  });
});