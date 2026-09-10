/**
 * Nihol identity: a rising sun over cultivated field rows and an outlined wordmark.
 * No font dependency, embedded image, filter, or external resource is required.
 * Run: node scripts/build-brand.cjs
 */
const fs = require("node:fs");
const path = require("node:path");
const sharp = require("sharp");

const root = path.resolve(__dirname, "..");
const colors = { forest: "#172b20", lime: "#d7ed9a", ivory: "#f4f3eb" };
const fieldPaths = `
  <rect x="30" y="2" width="4" height="7" rx="2"/>
  <rect x="30" y="2" width="4" height="7" rx="2" transform="rotate(-48 32 25)"/>
  <rect x="30" y="2" width="4" height="7" rx="2" transform="rotate(48 32 25)"/>
  <path d="M20 25A12 12 0 0 1 44 25H20Z"/>
  <path d="M14 33H21L15 58H4L14 33Z"/>
  <path d="M26 33H30V58H21L26 33Z"/>
  <path d="M34 33H38L43 58H34V33Z"/>
  <path d="M43 33H50L60 58H49L43 33Z"/>`;
const wordPaths = `
  <path d="M89 53V26M89 38C89 21 112 21 112 36V53"/>
  <path d="M126 29V53"/>
  <path d="M141 53V10M141 38C141 21 164 21 164 36V53"/>
  <ellipse cx="188" cy="39" rx="12.5" ry="14.5"/>
  <path d="M215 10V44C215 50 217 53 223 53"/>`;

function logo(symbol, word) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="232" height="64" viewBox="0 0 232 64" fill="none" role="img" aria-labelledby="title"><title id="title">Nihol — agricultural solutions</title><g fill="${symbol}">${fieldPaths}</g><g stroke="${word}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">${wordPaths}</g><circle cx="126" cy="15" r="4.1" fill="${word}"/></svg>\n`;
}
function mark(color) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="${color}" role="img" aria-labelledby="title"><title id="title">Nihol field mark</title>${fieldPaths}</svg>\n`;
}
const primary = logo(colors.forest, colors.forest);
const inverse = logo(colors.lime, colors.ivory);
const monochrome = logo("#ffffff", "#ffffff");
const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="${colors.forest}"/><g transform="translate(7 7) scale(.78125)" fill="${colors.lime}">${fieldPaths}</g></svg>\n`;
const assets = {
  "public/brand/nihol-logo.svg": primary,
  "public/brand/nihol-logo-light.svg": inverse,
  "public/brand/nihol-logo-white.svg": monochrome,
  "public/brand/nihol-mark.svg": mark(colors.forest),
  "public/brand/nihol-mark-light.svg": mark(colors.lime),
  "public/nihol.svg": inverse,
  "public/nihol_color.svg": primary,
  "app/icon.svg": icon,
};
for (const [file, source] of Object.entries(assets))
  fs.writeFileSync(path.join(root, file), source);

async function buildPreviews() {
  const favicon = await sharp(Buffer.from(icon))
    .resize(32, 32)
    .png()
    .toBuffer();
  const header = Buffer.alloc(22);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  header[6] = 32;
  header[7] = 32;
  header.writeUInt16LE(1, 10);
  header.writeUInt16LE(32, 12);
  header.writeUInt32LE(favicon.length, 14);
  header.writeUInt32LE(22, 18);
  fs.writeFileSync(
    path.join(root, "app/favicon.ico"),
    Buffer.concat([header, favicon]),
  );
  await sharp(Buffer.from(icon))
    .resize(180, 180)
    .png()
    .toFile(path.join(root, "app/apple-icon.png"));
  await sharp(Buffer.from(primary))
    .resize(1392, 384)
    .png()
    .toFile(path.join(root, "public/brand/nihol-logo.png"));
  const panel = (svg, x, y, width) => ({
    input: Buffer.from(
      svg.replace(
        'width="232" height="64"',
        `width="${width}" height="${(width * 64) / 232}"`,
      ),
    ),
    left: x,
    top: y,
  });
  await sharp({
    create: { width: 1200, height: 760, channels: 4, background: colors.ivory },
  })
    .composite([
      {
        input: Buffer.from(
          `<svg width="1200" height="760"><rect x="600" width="600" height="760" fill="${colors.forest}"/></svg>`,
        ),
        left: 0,
        top: 0,
      },
      panel(primary, 100, 230, 400),
      panel(inverse, 700, 230, 400),
      panel(primary, 100, 545, 145),
      panel(inverse, 700, 545, 145),
      { input: Buffer.from(icon), left: 420, top: 535 },
      { input: Buffer.from(icon), left: 1020, top: 535 },
    ])
    .png()
    .toFile(path.join(root, "public/brand/nihol-brand-preview.png"));
}
buildPreviews().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
