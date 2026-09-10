// Run after the Blender build to prepare compact web fallbacks.
const path = require("node:path");
const sharp = require("sharp");
const directory = path.resolve(__dirname, "../../public/models");
Promise.all(
  ["soil", "water", "nutrition"].map((name) =>
    sharp(path.join(directory, `${name}.png`))
      .webp({ quality: 85 })
      .toFile(path.join(directory, `${name}.webp`)),
  ),
).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
