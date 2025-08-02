// tcpServer.js
const net = require("net");
const deviceManager = require("./deviceManager");

const TCP_PORT = 9680;

// Create a TCP server
const server = net.createServer((socket) => {
  console.log(
    "New device connected:",
    socket.remoteAddress + ":" + socket.remotePort
  );

  socket.setKeepAlive(true);

  // Handle incoming data from devices
  socket.on("data", (data) => {
    console.log("Received:", data.toString());
  });

  // Handle socket close
  socket.on("end", () => {
    console.log(
      "Device disconnected:",
      socket.remoteAddress + ":" + socket.remotePort
    );
  });

  // Handle errors
  socket.on("error", (err) => {
    console.error("Socket error:", err.message);
  });
});

// Start listening
server.listen(TCP_PORT, () => {
  console.log(`TCP server listening on port ${TCP_PORT}`);
});
