const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');

async function buildIcons() {
  const app = path.resolve(__dirname, '../app');
  const source = path.join(app, 'icon.svg');
  await sharp(source).resize(180, 180).png().toFile(path.join(app, 'apple-icon.png'));
  const png = await sharp(source).resize(64, 64).png().toBuffer();
  const header = Buffer.alloc(22);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  header[6] = 64;
  header[7] = 64;
  header.writeUInt16LE(1, 10);
  header.writeUInt16LE(32, 12);
  header.writeUInt32LE(png.length, 14);
  header.writeUInt32LE(22, 18);
  fs.writeFileSync(path.join(app, 'favicon.ico'), Buffer.concat([header, png]));
}

buildIcons().catch((error) => { console.error(error); process.exitCode = 1; });
