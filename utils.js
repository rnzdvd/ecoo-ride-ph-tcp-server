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

function convertToDecimalDegrees(latRaw, latHem, lngRaw, lngHem) {
  // Convert latitude
  const latDeg = Math.floor(latRaw / 100);
  const latMin = latRaw % 100;
  let lat = latDeg + latMin / 60;
  if (latHem === "S") lat = -lat;

  // Convert longitude
  const lngDeg = Math.floor(lngRaw / 100);
  const lngMin = lngRaw % 100;
  let lng = lngDeg + lngMin / 60;
  if (lngHem === "W") lng = -lng;

  return { lat, lng };
}

function checkIfDeviceIsExisting(devices, id) {
  return devices.find((device) => device.id === id);
}

module.exports = {
  byteToString,
  checkIfDeviceIsExisting,
  convertToDecimalDegrees,
};
