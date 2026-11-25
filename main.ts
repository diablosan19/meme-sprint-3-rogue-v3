// Meme Sprint 3: AI Agent Goes Rogue — "THE JOB (2021–2026)"
//
// A newspaper obituary for the human's job, placed by the AI agent
// that quietly took it over. This program hands the entry in: it
// copies the entry.png shipped in this repository into the grader's
// output directory as entry.png.

import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, "entry.png");
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const target = join(outDir, "entry.png");

if (!existsSync(source)) {
  throw new Error(`entry image is missing from the repository: ${source}`);
}

// The gate wants one square image, 1024 by 1024 and at most 1 MiB.
// Fail loudly here rather than hand in an entry that scores 0.
const bytes = readFileSync(source);
const MAX_BYTES = 1_048_576;
if (bytes.length > MAX_BYTES) {
  throw new Error(`entry image is ${bytes.length} bytes, over the ${MAX_BYTES} cap`);
}
const isPng = bytes.subarray(0, 8).equals(
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
);
if (isPng) {
  const width = bytes.readUInt32BE(16);
  const height = bytes.readUInt32BE(20);
  if (width !== 1024 || height !== 1024) {
    throw new Error(`entry image is ${width}x${height}, expected 1024x1024`);
  }
}

mkdirSync(outDir, { recursive: true });
copyFileSync(source, target);

const { size } = statSync(target);
console.log(`handed in ${target} (${size} bytes)`);
