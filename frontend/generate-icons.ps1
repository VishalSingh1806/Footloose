# PWA Icon Generator Script for Windows
  # Requires ImageMagick from https://imagemagick.org/script/download.php      
  
  Set-Location -Path "$PSScriptRoot\public"
                                                                               
  # Check if ImageMagick is installed
  if (-not (Get-Command magick -ErrorAction SilentlyContinue)) {
      Write-Host "Error: ImageMagick not found" -ForegroundColor Red
      Write-Host "Download from: https://imagemagick.org/script/download.php"  
  -ForegroundColor Yellow
      exit 1
  }

  # Check if icon.svg exists
  if (-not (Test-Path "icon.svg")) {
      Write-Host "Error: icon.svg not found in public folder" -ForegroundColor 
  Red
      exit 1
  }

  Write-Host "Generating PWA icons from icon.svg..." -ForegroundColor Cyan     
  Write-Host ""

  # Generate Android/PWA icons
  $sizes = @(72, 96, 128, 144, 152, 192, 384, 512)
  foreach ($size in $sizes) {
      magick icon.svg -resize "${size}x${size}" "icon-${size}.png"
      Write-Host "Generated icon-${size}.png" -ForegroundColor Green
  }

  # Generate iOS icons
  $appleSizes = @(120, 152, 167, 180)
  foreach ($size in $appleSizes) {
      magick icon.svg -resize "${size}x${size}" "apple-icon-${size}.png"       
      Write-Host "Generated apple-icon-${size}.png" -ForegroundColor Green     
  }

  Write-Host ""
  Write-Host "All icons generated successfully!" -ForegroundColor Green        
  Write-Host ""
  Write-Host "Next steps:" -ForegroundColor Cyan
  Write-Host "1. Test PWA installation on Android (Chrome)"
  Write-Host "2. Test Add to Home Screen on iOS (Safari)"
  Write-Host "3. Verify icons appear correctly on home screen"