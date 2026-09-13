// Minimal uncompressed PNG generator for the game icon
const fs = require('fs');
const zlib = require('zlib');

function createPng(width, height) {
  // RGBA buffer with raw scanlines
  const rowSize = width * 4 + 1; // +1 for filter byte
  const rawData = Buffer.alloc(rowSize * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter: None

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      
      // Calculate distance from center for rounded glow
      const cx = width / 2;
      const cy = height / 2;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Neon Cyan and Pink gradient background with dark center
      if (dist < width * 0.45) {
        // Neon Box / Character Icon
        const inBox = Math.abs(dx) < width * 0.28 && Math.abs(dy) < height * 0.28;
        if (inBox) {
          // Cyan gradient
          rawData[pxOffset] = 0;      // R
          rawData[pxOffset + 1] = 240; // G
          rawData[pxOffset + 2] = 255; // B
          rawData[pxOffset + 3] = 255; // A
        } else {
          // Dark neon purple background
          rawData[pxOffset] = 20;
          rawData[pxOffset + 1] = 24;
          rawData[pxOffset + 2] = 45;
          rawData[pxOffset + 3] = 255;
        }
      } else {
        // Transparent border
        rawData[pxOffset] = 0;
        rawData[pxOffset + 1] = 0;
        rawData[pxOffset + 2] = 0;
        rawData[pxOffset + 3] = 0;
      }
    }
  }

  const deflated = zlib.deflateSync(rawData);

  // PNG Header
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR Chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // Bit depth
  ihdrData[9] = 6; // Color type: RGBA
  ihdrData[10] = 0; // Compression
  ihdrData[11] = 0; // Filter
  ihdrData[12] = 0; // Interlace

  const ihdr = makeChunk('IHDR', ihdrData);
  const idat = makeChunk('IDAT', deflated);
  const iend = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdr, idat, iend]);
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);

  const chunkType = Buffer.from(type, 'ascii');
  const typeAndData = Buffer.concat([chunkType, data]);

  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(typeAndData), 0);

  return Buffer.concat([len, typeAndData, crc]);
}

function crc32(buf) {
  let table = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    table[n] = c;
  }
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = table[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

const icon = createPng(128, 128);
fs.writeFileSync('icon.png', icon);
console.log('icon.png başarıyla oluşturuldu!');
