const express = require('express');
const multer = require('multer');
const { encodeText, decodeText } = require('./steganography');
const app = express();
const port = 3000;
const key = "azertyqwerty";

// Middleware for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/api/encode', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'data', maxCount: 1 }]), (req, res) => {
    try {
        // Extract image buffer and text file from the request
        const imageBuffer = req.files['image'][0].buffer;
        const textFileBuffer = req.files['data'][0].buffer;
        
        // Convert the buffer to a string
        const textToEncode = textFileBuffer.toString('utf-8');

        // Encode data into the image
        const encodedImageBuffer = encodeText(imageBuffer, textToEncode, key);

        // Respond with the encoded image
        res.contentType('image/png');
        res.send(encodedImageBuffer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Endpoint for decoding text from an image
app.post('/api/decode', upload.single('image'), (req, res) => {
  try {
    // Extract image buffer from the request
    const imageBuffer = req.file.buffer;

    // Decode data from the image
    const decodedData = decodeText(imageBuffer, key);
    //console.log('Subset of Decoded Data:', decodedData.slice(0, 50)); // Displaying the first 50 characters

    // Respond with the decoded data as JSON
    res.json({ decodedData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
