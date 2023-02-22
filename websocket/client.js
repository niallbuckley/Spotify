const WebSocket = require("ws");

const socket = new WebSocket("ws://localhost:3000");

socket.addEventListener("open", () => {
  // send a message to the server
  for (let i=0; i < 5; i++){
    socket.send(JSON.stringify({
      type: "hello from client",
      content: [ 3, "4" ]
    }));
  }
});

// receive a message from the server
socket.addEventListener("message", ({ data }) => {
  const packet = JSON.parse(data);

  switch (packet.type) {
    case "hello from server":
      console.log("Client: message received from server")
      // ...
      break;
  }
});
