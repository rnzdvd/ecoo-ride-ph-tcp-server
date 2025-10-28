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

module.exports = { byteToString };
