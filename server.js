const express = require("express");
const deviceManager = require("./deviceManager");
const { lockDevice, unlockDevice, setLocationSentFrequency } =
  require("./tcpServer").default;

const app = express();
const port = 30001;

app.use(express.json());

// Get all connected scooters/devices
app.get("/api/scooters", (req, res) => {
  const devices = deviceManager.getAllDevices();
  const sanitized = devices.map(({ socket, ...rest }) => rest);
  res.json(sanitized);
});

// Get a specific scooter/device
app.get("/api/scooters/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const device = deviceManager.getDeviceById(id);
  if (device) {
    const { socket, ...clean } = device;
    res.json(clean);
  } else {
    res.status(404).json({ error: "Device not found" });
  }
});

// Lock scooter
app.post("/api/scooters/lock/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const device = deviceManager.getDeviceById(id);

  if (!device) {
    return res.json({
      success: false,
      action: "lock",
      message: "Device not found",
    });
  }

  try {
    const success = await lockDevice(device);
    res.json({ success, action: "lock" });
  } catch (err) {
    console.error("Error locking device:", err);
    res
      .status(500)
      .json({ success: false, action: "lock", error: err.message });
  }
});

// Unlock scooter
app.post("/api/scooters/unlock/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const device = deviceManager.getDeviceById(id);

  if (!device) {
    return res.json({
      success: false,
      action: "unlock",
      message: "Device not found",
    });
  }

  try {
    const success = await unlockDevice(device);
    res.json({ success, action: "unlock" });
  } catch (err) {
    console.error("Error unlocking device:", err);
    res
      .status(500)
      .json({ success: false, action: "unlock", error: err.message });
  }
});

// set the frequency of how often the scooter sends location data
app.post("/api/scooters/location-frequency/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const device = deviceManager.getDeviceById(id);
  if (device) {
    const frequency = req.query.frequency;
    setLocationSentFrequency(device, frequency.toString());
    res.json({ success: true, action: "set-location-frequency" });
  } else {
    res.json({ success: false, action: "set-location-frequency" });
  }
});

// Start HTTP server
app.listen(port, "0.0.0.0", () => {
  console.log(`✅ HTTP server running at http://178.128.24.61:${port}`);
});
