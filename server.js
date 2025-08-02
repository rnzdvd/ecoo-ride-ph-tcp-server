const express = require("express");
const deviceManager = require("./deviceManager");
const {
  lockDevice,
  unlockDevice,
  setLocationSentFrequency,
} = require("./tcpServer");

const app = express();
const port = 30001;

app.use(express.json()); // If you need to parse JSON bodies

// Get all connected scooters/devices
app.get("/api/scooters", (req, res) => {
  const devices = deviceManager.getAllDevices();
  res.json(devices);
});

// Get a specific scooter/device
app.get("/api/scooters/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const device = deviceManager.getDeviceById(id);
  if (device) {
    res.json(device);
  } else {
    res.status(404).json({ error: "Device not found" });
  }
});

// Lock scooter
app.post("/api/scooters/lock/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const device = deviceManager.getDeviceById(id);
  if (device) {
    const success = lockDevice(id);
    res.json({ success, action: "lock", id });
  } else {
    res.status(404).json({ error: "Device not found" });
  }
});

// Unlock scooter
app.post("/api/scooters/unlock/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const device = deviceManager.getDeviceById(id);
  if (device) {
    const success = unlockDevice(id);
    res.json({ success, action: "unlock", id });
  } else {
    res.status(404).json({ error: "Device not found" });
  }
});

// set the frequency of how often the scooter sends location data
app.post("/api/scooters/location-frequency/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const device = deviceManager.getDeviceById(id);
  if (device) {
    const frequency = req.query.frequency;
    const success = setLocationSentFrequency(id, frequency);
    res.json({ success, action: "set-location-frequency", id, frequency });
  } else {
    res.status(404).json({ error: "Device not found" });
  }
});

// Start HTTP server
app.listen(port, "0.0.0.0", () => {
  console.log(`✅ HTTP server running at http://178.128.24.61:${port}`);
});
