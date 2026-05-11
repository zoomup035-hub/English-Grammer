#!/usr/bin/env node

/**
 * Icon Generator Script
 * Converts SVG to PNG formats (192x192 and 512x512)
 * Uses sharp library for high-quality conversion
 */

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Configuration
const SVG_SOURCE = path.join(__dirname, 'icons', 'icon.svg');
const OUTPUT_DIR = path.join(__dirname, 'icons');
const SIZES = [
  { width: 192, height: 192, name: 'icon-192.png' },
  { width: 512, height: 512, name: 'icon-512.png' }
];

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`✓ Created icons directory: ${OUTPUT_DIR}`);
}

// Check if SVG source exists
if (!fs.existsSync(SVG_SOURCE)) {
  console.error(`✗ Error: icon.svg not found at ${SVG_SOURCE}`);
  process.exit(1);
}

console.log(`📄 Reading SVG: ${SVG_SOURCE}`);

// Process each size
async function generateIcons() {
  try {
    for (const size of SIZES) {
      const outputPath = path.join(OUTPUT_DIR, size.name);
      
      console.log(`\n🔄 Creating ${size.width}x${size.height} PNG...`);
      
      await sharp(SVG_SOURCE)
        .resize(size.width, size.height, {
          fit: 'contain',           // Fit entire image without cropping
          background: { r: 0, g: 0, b: 0, alpha: 0 }, // Transparent background
          position: 'center'
        })
        .png({ quality: 90, progressive: true })
        .toFile(outputPath);
      
      // Get file size
      const fileSize = fs.statSync(outputPath).size;
      const fileSizeKB = (fileSize / 1024).toFixed(2);
      
      console.log(`✓ Generated: ${outputPath}`);
      console.log(`  └─ Size: ${fileSizeKB} KB`);
    }
    
    console.log('\n✅ All icons generated successfully!');
    console.log('\n📋 Generated files:');
    SIZES.forEach(size => {
      console.log(`   • icons/${size.name} (${size.width}x${size.height}px)`);
    });
    
  } catch (error) {
    console.error('\n✗ Error generating icons:', error.message);
    process.exit(1);
  }
}

// Run the generation
generateIcons();
