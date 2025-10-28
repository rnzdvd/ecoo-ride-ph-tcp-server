// tcpServer.js
const net = require("net");
const deviceManager = require("./deviceManager");
const { buildCommand } = require("./scooterCommand");

const TCP_PORT = 9680;

// Heartbeat watchdog
const OFFLINE_THRESHOLD = 180000; // 3 min

setInterval(() => {
  const now = Date.now();
  deviceManager.getAllDevices().forEach((d) => {
    if (d.status === "online" && now - d.lastSeen > OFFLINE_THRESHOLD) {
      deviceManager.markOffline(d.socket);
      console.log(`Device ${d.id} marked offline (no updates > 1 min)`);
    }
  });
}, 10000); // check every 10s

setInterval(() => {
  const devices = deviceManager.getAllDevices();
  const totalDevices = devices.length;
  const totalInterval = 30000; // 30 seconds total cycle
  const delayPerDevice = totalInterval / totalDevices;

  console.log(
    `Sending commands to ${totalDevices} devices (every ${delayPerDevice.toFixed(
      0
    )} ms)`
  );

  devices.forEach((d, i) => {
    setTimeout(() => {
      if (d.socket) {
        d.socket.write(buildCommand(d.id, "S6")); // Battery level
        d.socket.write(buildCommand(d.id, "D1", "10")); // Location update
      }
    }, i * delayPerDevice);
  });
}, 30000);

// Create a TCP server
const server = net.createServer((socket) => {
  socket.setKeepAlive(true);
  socket.setTimeout(300000); // optional: 5-minute idle timeout

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

  socket.on("timeout", () => {
    console.log(`Socket timeout for ${socket.id}`);
    deviceManager.markOffline(socket);
    socket.destroy();
  });
});

async function lockDevice(device) {
  const socket = device.socket;
  if (socket) {
    socket.write(buildCommand(device.id, "D1", "60"));
    socket.write(buildCommand(device.id, "R0"));
    return true;
  }

  return false;
}

async function unlockDevice(device) {
  const socket = device.socket;

  if (socket) {
    socket.write(buildCommand(device.id, "D1", "6"));
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
