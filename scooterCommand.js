function buildCommand(imei, instructionType, payload) {
  const vendorCode = "OM"; // Usually fixed per device/manufacturer
  var body = "";
  // Build ASCII body
  if (payload) {
    body = `*SCOS,${vendorCode},${imei},${instructionType},${payload}#`;
  } else {
    body = `*SCOS,${vendorCode},${imei},${instructionType}#`;
  }
  // Build final packet: FF FF (header) + body + newline
  const header = Buffer.from([0xff, 0xff]);
  const bodyBuffer = Buffer.from(body + "\n", "ascii");
  const packet = Buffer.concat([header, bodyBuffer]);
  printPacket(packet);
  return packet;
}

function printPacket(packet) {
  // Extract header (first 2 bytes)
  const headerHex = packet.slice(0, 2).toString("hex").toUpperCase();

  // Extract body (rest of the packet)
  const bodyAscii = packet.slice(2).toString("ascii");

  // Print in the 0xFFFF*SCOS,...#<Wrap> style
  console.log(`0x${headerHex}${bodyAscii}`);
}

module.exports = {
  buildCommand,
};
