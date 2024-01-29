const { encodeText, decodeText } = require('./steganography');
const fs = require("fs");

const key = "azertyqwerty";

try {
    
    const imagePath = './encoded_image.png';
        // Extract image buffer from the request
    let imageBuffer = fs.readFileSync(imagePath);

        // Decode data from the image
    const decodedData = decodeText(imageBuffer, key);
        //console.log('Subset of Decoded Data:', decodedData.slice(0, 50)); // Displaying the first 50 characters

        // Respond with the decoded data as JSON
    console.log(decodedData)
} catch (error) {
    console.error(error);}
