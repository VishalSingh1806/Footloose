#!/bin/bash

# PWA Icon Generator Script
# Requires: ImageMagick (install with: sudo apt-get install imagemagick)

cd "$(dirname "$0")/public"

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "❌ Error: ImageMagick not found"
    echo "Install with: sudo apt-get install imagemagick"
    exit 1
fi

# Check if icon.svg exists
if [ ! -f "icon.svg" ]; then
    echo "❌ Error: icon.svg not found in public folder"
    exit 1
fi

echo "📱 Generating PWA icons from icon.svg..."
echo ""

# Generate Android/PWA icons
for size in 72 96 128 144 152 192 384 512; do
    convert icon.svg -resize ${size}x${size} icon-${size}.png
    echo "✅ Generated icon-${size}.png"
done

# Generate iOS icons
for size in 120 152 167 180; do
    convert icon.svg -resize ${size}x${size} apple-icon-${size}.png
    echo "✅ Generated apple-icon-${size}.png"
done

echo ""
echo "🎉 All icons generated successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Test PWA installation on Android (Chrome)"
echo "2. Test 'Add to Home Screen' on iOS (Safari)"
echo "3. Verify icons appear correctly on home screen"
