const express = require("express");
const deviceManager = require("./deviceManager");
require("./tcpServer");
const app = express();
const port = 30001;

app.get("/api/scooters", (req, res) => {
  const devices = deviceManager.getAllDevices();
  res.json(devices);
});

app.get("/api/scooters/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const device = deviceManager.getDeviceById(id);
  if (device) {
    res.json(device);
  } else {
    res.status(404).json({ error: "Device not found" });
  }
});

app.post("/api/scooters/lock/:id", (req, res) => {
  res.json({ message: "Device lock successfully" });
});

app.post("/api/scooters/unlock/:id", (req, res) => {
  res.json({ message: "Device unlock successfully" });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running at http://localhost:${port}`);
});
