// deviceManager.js

const { buildCommand } = require("./scooterCommand");
const {
  byteToString,
  checkIfDeviceIsExisting,
  convertToDecimalDegrees,
  getCurrentTimestamp,
} = require("./utils");
const crypto = require("crypto");

// copy this type of format to create a new device
// Dummy data simulating connected devices

// id: 1,
// name: "Scooter 001",
// status: "online",
// battery: 85,
// location: {
//   lat: 7.096222,
//   lng: 125.595869,
// },
// socket: null,
// lastSeen: null,

const devices = [];

// Function to get all devices
function getAllDevices() {
  return devices;
}

// Function to get a specific device by ID
function getDeviceById(id) {
  return devices.find((device) => device.id === id);
}

function getDeviceBySocket(socket) {
  if (!socket || !socket.id) return undefined;
  return devices.find((d) => d.socketId === socket.id);
}

function updateDeviceLocation(id, lat, lng, socket, lastSeen) {
  const device = devices.find((d) => d.id === id);
  if (device) {
    device.location.lat = lat;
    device.location.lng = lng;
    device.socket = socket;
    device.lastSeen = lastSeen;
    device.socketId = socket.id;
  }
}

function updateDeviceBattery(id, batteryLevel, socket, lastSeen) {
  const device = devices.find((d) => d.id === id);
  if (device) {
    device.battery = batteryLevel;
    device.socket = socket;
    device.lastSeen = lastSeen;
    device.socketId = socket.id;
  }
}

function addNewDevice(device) {
  devices.push(device);
}

function markOffline(socket) {
  if (!socket) {
    console.log("markOffline called with no socket");
    return;
  }
  const device = getDeviceBySocket(socket);

  if (!device) {
    console.log(`No matching device found for socket`);
    return; // prevents TypeError crash
  }

  // safely mark as offline
  device.status = "offline";
  device.lastSeen = getCurrentTimestamp();
  device.socket = null;
  device.socketId = null;

  console.log(`🟡 Device ${device.name || device.id} marked offline`);
}

function listenDevice(deviceData, socket) {
  // parse data details sent by the device
  // take note: when updating a device location or details always update also the socket & lastSeen
  // take note: this following function need to be added here.
  // add new device to the list
  // update location on existing device
  // update details on existing device
  // set the status as online automatically
  // 863957074480911
  const deviceDetails = byteToString(deviceData);
  const deviceId = deviceDetails.split(",")[2];
  const command = deviceDetails.split(",")[3];

  // Ensure socket has a UUID
  if (!socket.id) {
    socket.id = crypto.randomUUID();
    console.log(`Assigned socket ID for ${deviceId}: ${socket.id}`);
  }

  console.log("Scooter Response:", deviceDetails);

  // handle the heart beat command
  if (command === "H0") {
    const existing = getDeviceById(deviceId);
    if (!existing) {
      const newDevice = {
        id: deviceId,
        name: `ECOO ${deviceId.slice(-4)}`,
        status: "online",
        socket,
        lastSeen: getCurrentTimestamp(),
        battery: null,
        socketId: socket.id,
        location: { lat: null, lng: null },
      };
      addNewDevice(newDevice);
      console.log(`🟢 New device added: ${newDevice.name}`);
    } else {
      existing.status = "online";
      existing.socket = socket;
      existing.socketId = socket.id;
      existing.lastSeen = getCurrentTimestamp();
      console.log(`🔵 Device ${existing.name} reconnected and is now online.`);
    }
  } else if (command === "D0") {
    // get device location
    const deviceDetailsSplited = deviceDetails.split(",");
    const latRaw = deviceDetailsSplited[7];
    const latHem = deviceDetailsSplited[8];
    const lngRaw = deviceDetailsSplited[9];
    const lngHem = deviceDetailsSplited[10];

    const { lat, lng } = convertToDecimalDegrees(
      latRaw,
      latHem,
      lngRaw,
      lngHem
    );
    updateDeviceLocation(deviceId, lat, lng, socket, getCurrentTimestamp());
  } else if (command === "S6") {
    // get battery level
    const deviceDetailsSplited = deviceDetails.split(",");
    const batteryLevel = deviceDetailsSplited[4];
    updateDeviceBattery(deviceId, batteryLevel, socket, getCurrentTimestamp());
  } else if (command === "R0") {
    // unlock the command for lock/unlock scooter
    const operationKey = deviceDetails.split(",")[5];
    const userId = deviceDetails.split(",")[6];
    const operation = deviceDetails.split(",")[4];

    if (operation === "0") {
      // unlocking scooter
      socket.write(
        buildCommand(
          deviceId,
          "L0",
          `${operationKey},${userId},${getCurrentTimestamp()}`
        )
      );
    } else {
      // locking scooter
      socket.write(buildCommand(deviceId, "L1", `${operationKey}`));
    }
  } else if (command === "L0") {
    // for verification for unlocking scooter
    socket.write(buildCommand(deviceId, "L0"));
  } else if (command === "L1") {
    // for verification for locking scooter
    socket.write(buildCommand(deviceId, "L1"));
  }
}

module.exports = {
  getAllDevices,
  getDeviceById,
  listenDevice,
  markOffline,
  byteToString,
  buildCommand,
  checkIfDeviceIsExisting,
  convertToDecimalDegrees,
  getCurrentTimestamp,
};
