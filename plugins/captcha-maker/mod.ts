import { createCanvas, loadImage } from 'https://deno.land/x/canvas/mod.ts';

// Define captcha parameters
const captchaWidth = 150;
const captchaHeight = 50;
const captchaLength = 6;
const skewAngle = -0.3; // in radians

// Generate captcha text
const captchaText = Math.random().toString(36).substring(2, captchaLength + 2);

// Create canvas
const canvas = createCanvas(captchaWidth, captchaHeight);
const ctx = canvas.getContext('2d');

// Draw background
ctx.fillStyle = '#f2f2f2';
ctx.fillRect(0, 0, captchaWidth, captchaHeight);

// Apply skew transformation
ctx.transform(1, 0, skewAngle, 1, 0, 0);

// Draw captcha text
ctx.font = '30px Arial';
ctx.fillStyle = '#000000';
ctx.fillText(captchaText, 25, 35);

// Remove skew transformation
ctx.setTransform(1, 0, 0, 1, 0, 0);

// Add noise to the image
for (let i = 0; i < captchaWidth; i++) {
  for (let j = 0; j < captchaHeight; j++) {
    const pixel = ctx.getImageData(i, j, 1, 1);
    const color = Math.floor(Math.random() * 40) + 215;
    pixel.data[0] += color;
    pixel.data[1] += color;
    pixel.data[2] += color;
    ctx.putImageData(pixel, i, j);
  }
}

// Save the captcha image
const buffer = canvas.toBuffer();
await Deno.writeFile('captcha.png', buffer);