const PNG = require('pngjs').PNG;

function encodeText(imageBuffer, key, text) {
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
    // Each character is encoded into the least significant bits of the red channel
    png.data[i * 4] = (png.data[i * 4] & 0xFE) | ((encryptedByte >> 7) & 0x01);
    png.data[i * 4 + 1] = (png.data[i * 4 + 1] & 0xFE) | ((encryptedByte >> 6) & 0x01);
    png.data[i * 4 + 2] = (png.data[i * 4 + 2] & 0xFE) | ((encryptedByte >> 5) & 0x01);
  }

  return PNG.sync.write(png);
}

function decodeText(encodedImageBuffer, key) {
  const png = PNG.sync.read(encodedImageBuffer);
  const keyBuffer = Buffer.from(key);

  // Extract the text from the encoded image
  let decodedTextBuffer = Buffer.alloc(png.data.length / 4);
  for (let i = 0; i < decodedTextBuffer.length; i++) {
    // Retrieve the least significant bits of the red channel
    let encryptedByte = png.data[i * 4] & 0x01;
    encryptedByte = (encryptedByte << 1) | (png.data[i * 4 + 1] & 0x01);
    encryptedByte = (encryptedByte << 1) | (png.data[i * 4 + 2] & 0x01);

    // Log the values for debugging
    //console.log(`i=${i}, r=${png.data[i * 4]}, g=${png.data[i * 4 + 1]}, b=${png.data[i * 4 + 2]}, encryptedByte=${encryptedByte}`);

    // XOR with the key to decrypt the byte
    decodedTextBuffer[i] = encryptedByte ^ keyBuffer[i % keyBuffer.length];
  }

  // Convert the buffer to a string
  const decodedText = decodedTextBuffer.toString('utf8').replace(/\0/g, ''); // Remove null bytes

  return decodedText;
}
  

module.exports = { decodeText, encodeText };
