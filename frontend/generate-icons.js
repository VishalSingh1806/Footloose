const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const appleSizes = [120, 152, 167, 180];

async function generateIcons() {
  const svgPath = path.join(__dirname, 'public', 'icon.svg');
  const publicDir = path.join(__dirname, 'public');

  // Check if SVG exists
  if (!fs.existsSync(svgPath)) {
    console.error('❌ Error: icon.svg not found at', svgPath);
    process.exit(1);
  }

  console.log('📱 Generating PWA icons from icon.svg...\n');

  // Generate Android/PWA icons
  for (const size of sizes) {
    try {
      await sharp(svgPath)
        .resize(size, size)
        .png()
        .toFile(path.join(publicDir, `icon-${size}.png`));
      console.log(`✅ Generated icon-${size}.png`);
    } catch (error) {
      console.error(`❌ Error generating icon-${size}.png:`, error.message);
    }
  }

  // Generate iOS icons
  for (const size of appleSizes) {
    try {
      await sharp(svgPath)
        .resize(size, size)
        .png()
        .toFile(path.join(publicDir, `apple-icon-${size}.png`));
      console.log(`✅ Generated apple-icon-${size}.png`);
    } catch (error) {
      console.error(`❌ Error generating apple-icon-${size}.png:`, error.message);
    }
  }

  console.log('\n🎉 All icons generated successfully!');
  console.log('\n📋 Next steps:');
  console.log('1. Test PWA installation on Android (Chrome)');
  console.log('2. Test "Add to Home Screen" on iOS (Safari)');
  console.log('3. Verify icons appear correctly on home screen');
}

generateIcons().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
