// deviceManager.js

// copy this type of format to create a new device
//  {
//     id: 1,
//     name: "Scooter 001",
//     status: "online",
//     battery: 85,
//     location: {
//       lat: 14.55,
//       lng: 121.02,
//     },
//   },

// Dummy data simulating connected devices
const devices = [];

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

function listenDevice(device) {
  // parse data details sent by the device

  // take note: this following function need to be added here.
  // add new device to the list
  // update location on existing device
  // update details on existing device

  console.log("device details", device);
}

module.exports = {
  getAllDevices,
  getDeviceById,
  listenDevice,
};
