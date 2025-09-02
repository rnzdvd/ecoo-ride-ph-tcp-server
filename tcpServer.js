// tcpServer.js
const net = require("net");
const deviceManager = require("./deviceManager");
const { buildCommand } = require("./scooterCommand");

const TCP_PORT = 9680;

const map = new Map();
// Create a TCP server
const server = net.createServer((socket) => {
  socket.setKeepAlive(true);

  // Handle incoming data from devices
  socket.on("data", (data) => {
    // record the device here
    deviceManager.listenDevice(data, socket);
  });

  // Handle socket close
  socket.on("end", () => {
    // mark scooter as offline
    console.log("Device disconnected:", socket);
    deviceManager.markOffline(socket);
  });

  socket.on("close", (hadError) => {
    // mark scooter as offline
    console.log("Device connection closed. Had error?", hadError);
    deviceManager.markOffline(socket);
  });

  // Handle errors
  socket.on("error", (err) => {
    // mark scooter as offline
    console.log("Socket error:", err.message);
    deviceManager.markOffline(socket);
  });
});

async function lockDevice(device) {
  const socket = device.socket;
  if (socket) {
    socket.write(buildCommand(device.id, "R0"));
    return true;
  }

  return false;
}

async function unlockDevice(device) {
  const socket = device.socket;

  if (socket) {
    socket.write(buildCommand(device.id, "R0"));
    return true;
  }
  return false;
}

function setLocationSentFrequency(device, frequency) {
  const socket = device.socket;
  if (socket) {
    socket.write(buildCommand(device.id, "D1", frequency));
    return true;
  }
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
