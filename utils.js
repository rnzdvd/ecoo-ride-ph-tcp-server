// utils/byteToString.js

/**
 * Converts a Buffer or byte array into a UTF-8 string.
 *
 * @param {Buffer | number[]} bytes - The raw bytes or Node.js Buffer.
 * @returns {string} The decoded string (trimmed of trailing newlines or spaces).
 */
function byteToString(bytes) {
  if (!bytes) return "";

  // Handle both Buffer and array input
  const buffer = Buffer.isBuffer(bytes) ? bytes : Buffer.from(bytes);

  // Convert to UTF-8 string and trim newlines/spaces
  return buffer.toString("utf8").trim();
}

function getBatteryPercent(rawVoltage) {
  // Convert raw value (unit: 0.1V) to actual volts
  const voltage = rawVoltage * 0.1;

  // Define pack limits (10S Li-ion: 33V empty, 42V full)
  const minV = 33.0;
  const maxV = 42.0;

  // Linear percentage estimate
  let percent = ((voltage - minV) / (maxV - minV)) * 100;

  // Clamp between 0% and 100%
  if (percent < 0) percent = 0;
  if (percent > 100) percent = 100;

  return parseFloat(percent.toFixed(1)); // 1 decimal place
}

function checkIfDeviceIsExisting(devices, id) {
  return devices.find((device) => device.id === id);
}

module.exports = { byteToString, getBatteryPercent, checkIfDeviceIsExisting };
