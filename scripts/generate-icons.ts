import sharp from "sharp";
import { mkdirSync } from "fs";
import { join } from "path";

const INPUT = join(process.cwd(), "public", "icon-source.jpg");
const OUT_DIR = join(process.cwd(), "public", "icons");

const sizes = [
  { name: "icon-192.png", size: 192 },
  { name: "icon-512.png", size: 512 },
  { name: "apple-touch-icon.png", size: 180 },
  { name: "favicon-32.png", size: 32 },
  { name: "favicon-16.png", size: 16 },
];

async function run() {
  mkdirSync(OUT_DIR, { recursive: true });
  for (const { name, size } of sizes) {
    await sharp(INPUT).resize(size, size).png().toFile(join(OUT_DIR, name));
    console.log(`✓ ${name}`);
  }
}

run();
