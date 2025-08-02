// tcpServer.js
const net = require("net");
const deviceManager = require("./deviceManager");

const TCP_PORT = 9680;

const map = new Map();
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

function lockDevice(deviceId) {
  // const socket = connectedDevices.get(deviceId);
  // if (socket) {
  //   socket.write("LOCK\n"); // adjust to your protocol
  //   return true;
  // }
  console.log("Locking device", deviceId);
  return true;
}

function unlockDevice(deviceId) {
  // const socket = connectedDevices.get(deviceId);
  // if (socket) {
  //   socket.write("UNLOCK\n"); // adjust to your protocol
  //   return true;
  // }
  console.log("Unlocking device", deviceId);
  return true;
}

function setLocationSentFrequency(deviceId, frequency) {
  // const socket = connectedDevices.get(deviceId);
  // if (socket) {
  //   socket.write("LOCATION " + frequency + "\n"); // adjust to your protocol
  //   return true;
  // }
  console.log("Setting location sent frequency", deviceId, frequency);
  return true;
}

// Start listening
server.listen(TCP_PORT, () => {
  console.log(`TCP server listening on port ${TCP_PORT}`);
});

module.exports = {
  lockDevice,
  unlockDevice,
  setLocationSentFrequency,
};
