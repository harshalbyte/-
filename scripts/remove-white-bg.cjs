const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

async function removeBackground(inputPath, outputPath) {
  const img = await loadImage(inputPath);
  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const saturation = max > 0 ? (max - min) / max : 0; // HSV saturation (0=gray, 1=vivid)
    const brightness = max / 255;                        // HSV brightness (0=black, 1=white)

    // Remove pixels that are bright AND desaturated = white/gray background
    // Keep colorful pixels (pink petals, green leaves, dark brown branch)
    const isBackground =
      (brightness > 0.70 && saturation < 0.15) || // medium-gray to white desaturated
      (brightness > 0.88 && saturation < 0.22);   // near-white with slight color cast

    if (isBackground) {
      data[i + 3] = 0; // fully transparent
    }
  }

  ctx.putImageData(imageData, 0, 0);
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);
  console.log(`Saved: ${outputPath} (${img.width}x${img.height})`);
}

removeBackground(
  path.join(__dirname, '../public/sakura-branch.png'),
  path.join(__dirname, '../public/sakura-branch-transparent.png'),
).catch(console.error);

