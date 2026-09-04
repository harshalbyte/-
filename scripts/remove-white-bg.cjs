// Converts the sakura-branch.png (which may be a JPEG) into a proper PNG
// with white pixels removed (made transparent) using canvas
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

async function removeWhiteBackground(inputPath, outputPath, threshold = 240) {
  const img = await loadImage(inputPath);
  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    // If the pixel is near-white, make it transparent
    if (r > threshold && g > threshold && b > threshold) {
      data[i + 3] = 0; // alpha = 0
    }
  }

  ctx.putImageData(imageData, 0, 0);
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);
  console.log('Saved transparent PNG to', outputPath);
}

removeWhiteBackground(
  path.join(__dirname, '../public/sakura-branch.png'),
  path.join(__dirname, '../public/sakura-branch-transparent.png'),
).catch(console.error);
