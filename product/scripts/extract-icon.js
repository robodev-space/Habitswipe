/**
 * extract-icon.js
 * Extracts the largest PNG frame from favicon.ico and writes it as PWA icons.
 * Uses only Node.js built-ins — no extra dependencies.
 *
 * Usage: node scripts/extract-icon.js
 */

const fs = require("fs");
const path = require("path");

const icoPath = path.join(__dirname, "../app/favicon.ico");
const publicDir = path.join(__dirname, "../public");

const buf = fs.readFileSync(icoPath);

// Parse ICO directory header
const count = buf.readUInt16LE(4);
let largest = null;
let largestSize = 0;

for (let i = 0; i < count; i++) {
  const off = 6 + i * 16;
  const w = buf[off] || 256;
  const h = buf[off + 1] || 256;
  const dataSize = buf.readUInt32LE(off + 8);
  const dataOff = buf.readUInt32LE(off + 12);
  const type = buf.slice(dataOff, dataOff + 4).toString("hex");

  console.log(`  [${i}] ${w}x${h} — format: ${type === "89504e47" ? "PNG" : "BMP"} — ${dataSize} bytes`);

  if (w * h > largestSize) {
    largestSize = w * h;
    largest = { w, h, dataSize, dataOff, type };
  }
}

if (!largest) {
  console.error("No frames found in ICO");
  process.exit(1);
}

if (largest.type !== "89504e47") {
  console.error("Largest frame is BMP, not PNG. Cannot extract without image library.");
  process.exit(1);
}

// Extract the raw PNG bytes
const pngBytes = buf.slice(largest.dataOff, largest.dataOff + largest.dataSize);
console.log(`\nExtracted ${largest.w}x${largest.h} PNG (${pngBytes.length} bytes)`);

// Write directly as source — for 64x64 source the upscaling needs a real image lib.
// We'll write the exact PNG for both sizes (browser will upscale from 64px natively).
// For production you'd want a proper raster tool, but this is correct PWA format.
const out192 = path.join(publicDir, "icon-192x192.png");
const out512 = path.join(publicDir, "icon-512x512.png");

fs.writeFileSync(out192, pngBytes);
fs.writeFileSync(out512, pngBytes);

console.log(`\nWritten:`);
console.log(`  → ${out192}`);
console.log(`  → ${out512}`);
console.log(`\nDone. The favicon's PNG is now your PWA icon.`);
console.log(`Note: both files contain the original ${largest.w}x${largest.h} image.`);
console.log(`Browsers handle the upscaling. For crisp icons at all sizes,`);
console.log(`provide a high-res PNG source (256x256+) by replacing app/favicon.ico.`);
