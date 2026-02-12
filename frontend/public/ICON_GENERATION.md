# PWA Icon Generation Guide

## Current Status
The app has a basic SVG icon at `/public/icon.svg` that needs to be converted to PNG files.

## Required Icon Sizes

### Android (PNG)
- `icon-72.png` - 72x72
- `icon-96.png` - 96x96
- `icon-128.png` - 128x128
- `icon-144.png` - 144x144
- `icon-152.png` - 152x152
- `icon-192.png` - 192x192 (required)
- `icon-384.png` - 384x384
- `icon-512.png` - 512x512 (required)

### iOS (PNG)
- `apple-icon-120.png` - 120x120 (iPhone)
- `apple-icon-152.png` - 152x152 (iPad)
- `apple-icon-167.png` - 167x167 (iPad Pro)
- `apple-icon-180.png` - 180x180 (iPhone)

## How to Generate Icons

### Option 1: Using Online Tool (Recommended)
1. Go to https://realfavicongenerator.net/
2. Upload `/public/icon.svg`
3. Configure settings:
   - iOS: Check "Add solid background color" with #E63946
   - Android: Enable "Maskable icon"
4. Download and extract all icons to `/public/` folder

### Option 2: Using ImageMagick (Command Line)
```bash
# Install ImageMagick first
# Then run these commands from the public folder:

convert icon.svg -resize 72x72 icon-72.png
convert icon.svg -resize 96x96 icon-96.png
convert icon.svg -resize 128x128 icon-128.png
convert icon.svg -resize 144x144 icon-144.png
convert icon.svg -resize 152x152 icon-152.png
convert icon.svg -resize 192x192 icon-192.png
convert icon.svg -resize 384x384 icon-384.png
convert icon.svg -resize 512x512 icon-512.png
convert icon.svg -resize 120x120 apple-icon-120.png
convert icon.svg -resize 152x152 apple-icon-152.png
convert icon.svg -resize 167x167 apple-icon-167.png
convert icon.svg -resize 180x180 apple-icon-180.png
```

### Option 3: Using Node.js Script
```javascript
// generate-icons.js
const sharp = require('sharp');
const fs = require('fs');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const appleSizes = [120, 152, 167, 180];

async function generateIcons() {
  for (const size of sizes) {
    await sharp('public/icon.svg')
      .resize(size, size)
      .png()
      .toFile(`public/icon-${size}.png`);
    console.log(`Generated icon-${size}.png`);
  }

  for (const size of appleSizes) {
    await sharp('public/icon.svg')
      .resize(size, size)
      .png()
      .toFile(`public/apple-icon-${size}.png`);
    console.log(`Generated apple-icon-${size}.png`);
  }
}

generateIcons();
```

Run with:
```bash
npm install sharp
node generate-icons.js
```

## Design Guidelines

### Icon Design Tips
- **Keep it simple**: Icon will be small, avoid too much detail
- **High contrast**: Use bold colors and shapes
- **No text**: Except for logo/brand letters
- **Safe zone**: Keep important elements in center 80% of icon
- **Test at different sizes**: Check how it looks at 48px, 72px, 192px

### Current Icon
- Red background (#E63946) - brand color
- White heart symbol - represents matchmaking/connections
- "F" letter - Footloose brand
- Works well at all sizes
- Maskable icon compatible

## Maskable Icons
For Android adaptive icons, ensure:
- Important content is in center 80% (safe zone)
- Background extends to full 512x512
- No transparency at edges

## Testing
1. **Android**: Open in Chrome, install PWA
2. **iOS**: Open in Safari, "Add to Home Screen"
3. Check icon appears correctly on home screen
4. Verify splash screen uses correct icon

## Update Manifest After Generation
Once icons are generated, update `manifest.json` to include all sizes:

```json
"icons": [
  {
    "src": "/icon-72.png",
    "sizes": "72x72",
    "type": "image/png"
  },
  // ... add all sizes
]
```

## Branding Colors
- Primary: #E63946 (Red)
- Background: #FAFAFA (Light Gray)
- Text: #1D3557 (Dark Blue)
- Accent: #2A9D8F (Teal)
