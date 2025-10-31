function buildCommand(imei, instructionType, payload) {
  const vendorCode = "OM"; // Usually fixed per device/manufacturer
  var body = "";
  // Build ASCII body
  if (payload) {
    body = `*SCOS,${vendorCode},${imei},${instructionType},${payload}`;
  } else {
    body = `*SCOS,${vendorCode},${imei},${instructionType}`;
  }
  // // Build final packet: FF FF (header) + body + newline
  // const header = Buffer.from([0xff, 0xff]);
  // const bodyBuffer = Buffer.from(body + "\n", "ascii");
  // const packet = Buffer.concat([header, bodyBuffer]);
  // printPacket(packet);
  // return packet;

  const sendOrder = getSendOrder(body);
  printPacket(sendOrder);

  return sendOrder;
}

function printPacket(packet) {
  // Extract header (first 2 bytes)
  const headerHex = packet.slice(0, 2).toString("hex").toUpperCase();

  // Extract body (rest of the packet)
  const bodyAscii = packet.slice(2).toString("ascii");

  // Print in the 0xFFFF*SCOS,...#<Wrap> style
  console.log(`Command Sent: 0x${headerHex}${bodyAscii}`);
}

function getSendOrder(body) {
  // command
  let order = `${body}#\r\n`;
  // 添加 0xFF, 0xFF
  return addByte([0xff, 0xff], order);
}

function addByte(b1, b2) {
  // 将字符串转换为 Buffer，如果已经是 Buffer 则直接使用
  b1 = Buffer.isBuffer(b1) ? b1 : Buffer.from(b1);
  b2 = Buffer.isBuffer(b2) ? b2 : Buffer.from(b2);

  let b = Buffer.alloc(b1.length + b2.length);
  b1.copy(b, 0);
  b2.copy(b, b1.length);
  return b;
}

module.exports = {
  buildCommand,
};
