// deviceManager.js

// Dummy data simulating connected devices
const devices = [
  {
    id: 1,
    name: "Scooter 001",
    status: "online",
    battery: 85,
    location: {
      lat: 14.55,
      lng: 121.02,
    },
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

// Function to simulate updating a device (e.g. from TCP data)
function updateDevice(id, newData) {
  const device = devices.find((d) => d.id === id);
  if (device) {
    Object.assign(device, newData);
  }
}

function addDevice(device) {
  devices.push(device);
}

module.exports = {
  getAllDevices,
  getDeviceById,
  updateDevice,
  addDevice,
};
