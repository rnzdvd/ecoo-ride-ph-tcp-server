// tcpServer.js
const net = require("net");
const deviceManager = require("./deviceManager");

const TCP_PORT = 9680;

const map = new Map();
// Create a TCP server
const server = net.createServer((socket) => {
  socket.setKeepAlive(true);

  // Handle incoming data from devices
  socket.on("data", (data) => {
    // record the device here
    console.log("Received:", data.toString());
    deviceManager.listenDevice(data, socket);
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

function lockDevice(device) {
  const socket = device.socket;
  if (socket) {
    socket.write("LOCK\n"); // adjust to your protocol
    return true;
  }
  console.log("Locking device", device.name);
  return false;
}

function unlockDevice(device) {
  const socket = device.socket;
  if (socket) {
    socket.write("UNLOCK\n"); // adjust to your protocol
    return true;
  }
  console.log("Unlocking device", device.name);
  return false;
}

function setLocationSentFrequency(device, frequency) {
  const socket = device.socket;
  if (socket) {
    socket.write("LOCATION " + frequency + "\n"); // adjust to your protocol
    return true;
  }
  console.log("Setting location sent frequency", device.name, frequency);
  return false;
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
