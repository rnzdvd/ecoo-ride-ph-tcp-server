// deviceManager.js

const { buildCommand } = require("./scooterCommand");
const { byteToString, checkIfDeviceIsExisting } = require("./utils");

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
  return devices.find((d) => d.socket === socket);
}

// Function to simulate updating a device (e.g. from TCP data)
function updateDevice(id, newData) {
  const device = devices.find((d) => d.id === id);
  if (device) {
    Object.assign(device, newData);
  }
}

function updateDeviceLocation(id, lat, lng) {
  const device = devices.find((d) => d.id === id);
  if (device) {
    device.location.lat = lat;
    device.location.lng = lng;
  }
}

function addNewDevice(device) {
  devices.push(device);
}

function markOffline(socket) {
  if (socket) {
    const device = getDeviceBySocket(socket);
    device.status = "offline";
    device.socket = null;
    console.log(`Scooter ${device.name} is now offline.`);
  } else {
    console.log(`The socket of the scooter is null,`);
  }
}

function listenDevice(deviceData, socket) {
  // parse data details sent by the device

  // take note: when updating a device location or details always update also the socket & lastSeen

  // take note: this following function need to be added here.
  // add new device to the list
  // update location on existing device
  // update details on existing device
  // set the status as online automatically
  const deviceDetails = byteToString(deviceData);
  const deviceId = deviceDetails.split(",")[2];
  console.log("Device Details:", deviceDetails);

  if (deviceDetails.includes("L5")) {
    const newDevice = {};
    if (!checkIfDeviceIsExisting(devices, deviceId)) {
      newDevice.id = deviceId;
      newDevice.name = `ECOO ${deviceId.slice(-4)}`;
      newDevice.status = "online";
      newDevice.socket = socket;
      newDevice.lastSeen = Date.now();
      newDevice.battery = null;
      newDevice.location = {
        lat: null,
        lng: null,
      };
      addNewDevice(newDevice);
      console.log(`New device added: ${newDevice}`);
    } else {
      const device = getDeviceById(deviceId);
      device.status = "online";
      device.socket = socket;
      device.lastSeen = Date.now();
      updateDevice(deviceId, device);
      console.log(`Device ${device.name} is now online.`);
    }
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
};
