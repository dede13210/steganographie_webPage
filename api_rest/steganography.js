const PNG = require('pngjs').PNG;

function encodeText(imageBuffer, text, key) {
  const png = PNG.sync.read(imageBuffer);
  const textBuffer = Buffer.from(text);
  const keyBuffer = Buffer.from(key);

  // Ensure there is enough space in the image to encode the text
  if (textBuffer.length > png.data.length / 4) {
    throw new Error('Text is too long to encode in the given image.');
  }

  // Encode the text into the image using XOR with the key
for (let i = 0; i < textBuffer.length; i++) {
  const encryptedByte = textBuffer[i] ^ keyBuffer[i % keyBuffer.length];
  for (let bit = 0; bit < 8; bit++) {
    const pixelIndex = (i * 8 + bit) * 4; // Moving 8 pixels (24 channels) for each byte
    const bitValue = (encryptedByte >> (7 - bit)) & 0x01; // Extracting each bit
    png.data[pixelIndex] = (png.data[pixelIndex] & 0xFE) | bitValue; // Red channel
  }
}
  return PNG.sync.write(png);
}

function decodeText(encodedImageBuffer, key) {
  const png = PNG.sync.read(encodedImageBuffer);
  const keyBuffer = Buffer.from(key);

  // Extract the text from the encoded image
  let decodedTextBuffer = Buffer.alloc(png.data.length / (4 * 8)); // 8 pixels per byte
  for (let i = 0; i < decodedTextBuffer.length; i++) {
    let encryptedByte = 0;
    for (let bit = 0; bit < 8; bit++) {
      const pixelIndex = (i * 8 + bit) * 4;
      encryptedByte |= (png.data[pixelIndex] & 0x01) << (7 - bit); // Reconstructing each byte
    }
    decodedTextBuffer[i] = encryptedByte ^ keyBuffer[i % keyBuffer.length];
  }


  // Convert the buffer to a string
  const decodedText = decodedTextBuffer.toString('utf8').replace(/\0/g, ''); // Remove null bytes

  return decodedText;
}
  

module.exports = { decodeText, encodeText };