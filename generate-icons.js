import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple script to copy the base SVG to different PNG sizes
// For production, you would use proper image generation tools

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = path.join(__dirname, 'public', 'icons');
const baseIcon = path.join(iconsDir, 'icon-base.svg');

console.log('Generating PWA icons...');

// For development, we'll just copy the SVG with different names
// In production, you would convert SVG to PNG at different sizes
sizes.forEach(size => {
  const targetFile = path.join(iconsDir, `icon-${size}x${size}.png`);
  
  // Create a simple HTML file that can be used to generate PNGs
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { margin: 0; padding: 20px; }
        svg { width: ${size}px; height: ${size}px; }
    </style>
</head>
<body>
    <svg width="${size}" height="${size}" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <rect width="512" height="512" rx="80" fill="#2563eb"/>
      <circle cx="256" cy="200" r="50" fill="#fbbf24"/>
      <g stroke="#fbbf24" stroke-width="8" stroke-linecap="round">
        <line x1="256" y1="100" x2="256" y2="120"/>
        <line x1="256" y1="280" x2="256" y2="300"/>
        <line x1="356" y1="200" x2="336" y2="200"/>
        <line x1="176" y1="200" x2="196" y2="200"/>
        <line x1="327" y1="129" x2="313" y2="143"/>
        <line x1="199" y1="257" x2="213" y2="243"/>
        <line x1="327" y1="271" x2="313" y2="257"/>
        <line x1="199" y1="143" x2="213" y2="157"/>
      </g>
      <path d="M180 300 Q160 280 180 260 Q200 240 240 260 Q280 240 320 260 Q340 280 320 300 Q340 320 320 340 L180 340 Q160 320 180 300 Z" fill="white"/>
      <text x="256" y="420" text-anchor="middle" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="white">CLIMA</text>
    </svg>
</body>
</html>`;
  
  const htmlFile = path.join(iconsDir, `icon-${size}x${size}.html`);
  fs.writeFileSync(htmlFile, htmlContent);
  console.log(`Generated template for ${size}x${size} icon`);
});

console.log('Icon generation complete!');
console.log('To generate actual PNG files, open each HTML file in a browser and take screenshots, or use a proper SVG to PNG converter.');