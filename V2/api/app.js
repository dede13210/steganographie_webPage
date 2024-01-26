const express = require('express');
const bodyParser = require('body-parser');
const lsb = require('lsb');
const sharp = require('sharp');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Endpoint pour cacher du texte dans une image
app.post('/hideText', (req, res) => {
    let { text } = req.body;
    const imagePath = 'image.png'; // Remplacez ceci par le chemin de votre image
    const imageBuffer = sharp(imagePath).toBuffer()

    // Fonction pour cacher du texte dans l'image
    const hideTextInImage = (text, imageBuffer) => {
        const stegImage = lsb.encode(imageBuffer, text);
        return stegImage;
    };

    // Vérifier la taille du texte et diviser si nécessaire
    const maxTextLength = 100;//todo recuperer le nombre max
    const dividedTexts = [];
    while (text.length > 0) {
        dividedTexts.push(text.substring(0, maxTextLength));
        text = text.substring(maxTextLength);
    }

    // Générer des images avec des parties du texte cachées
    const stegImages = dividedTexts.map((partText, index) => {
        return hideTextInImage(partText, imageBuffer);
    });

    res.json({ images: stegImages.map(image => image.toString('base64')) });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
