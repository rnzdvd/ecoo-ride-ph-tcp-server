// deviceManager.js

// copy this type of format to create a new device
//  {
//     id: 1,
//     name: "Scooter 001",
//     status: "online",
//     battery: 85,
//     location: {
//       lat: 7.096222,
//       lng: 125.595869,
//     },
//     socket: null,
//     lastSeen: null,
//   },

// Dummy data simulating connected devices
const devices = [
  {
    id: 1,
    name: "Scooter 001",
    status: "online",
    battery: 85,
    location: {
      lat: 7.096222,
      lng: 125.595869,
    },
    socket: null,
    lastSeen: null,
  },
  {
    id: 2,
    name: "Scooter 002",
    status: "online",
    battery: 85,
    location: {
      lat: 7.096765,
      lng: 125.595644,
    },
    socket: null,
    lastSeen: null,
  },
  {
    id: 3,
    name: "Scooter 003",
    status: "online",
    battery: 85,
    location: {
      lat: 7.097968,
      lng: 125.596025,
    },
    socket: null,
    lastSeen: null,
  },
  {
    id: 4,
    name: "Scooter 004",
    status: "online",
    battery: 85,
    location: {
      lat: 7.098751,
      lng: 125.594335,
    },
    socket: null,
    lastSeen: null,
  },
  {
    id: 5,
    name: "Scooter 005",
    status: "online",
    battery: 85,
    location: {
      lat: 7.098575,
      lng: 125.594233,
    },
    socket: null,
    lastSeen: null,
  },
];

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
  const device = getDeviceBySocket(socket);
  if (device) {
    device.status = "offline";
    device.socket = null;
    console.log(`Scooter ${device.name} is now offline.`);
  }
}

function listenDevice(deviceData, socket) {
  // parse data details sent by the device

  // take note: when updating a device location or details always update also the socket & lastSeen

  // take note: this following function need to be added here.
  // add new device to the list
  // update location on existing device
  // update details on existing device

  console.log("device details", deviceData);
  console.log("socket details", socket);
}

module.exports = {
  getAllDevices,
  getDeviceById,
  listenDevice,
  markOffline,
};
