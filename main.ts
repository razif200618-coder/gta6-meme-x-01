// gta6-meme-x-01 entry program (Node 22, standard library only).
//
// The entry is the X post itself: the meme, its picture and its text. This
// program's only job is to hand the gate the post's address, by copying the
// POST.json file from the repository into the output directory, where the
// gate reads it as /output/POST.json.
//
// Local run (mirrors the grader, with env vars standing in for /bot and
// /output):
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

mkdirSync(outputDir, { recursive: true });

try {
  copyFileSync(join(botDir, "POST.json"), join(outputDir, "POST.json"));
} catch (error) {
  console.error(
    `could not copy POST.json out of ${botDir}: ${(error as Error).message}`,
  );
  process.exit(1);
}

// Validate the copied file: it must parse as JSON with a string `url`
// field, so a broken POST.json fails loudly here instead of reaching the
// gate as an unreadable entry.
try {
  const parsed = JSON.parse(
    readFileSync(join(outputDir, "POST.json"), "utf8"),
  );
  if (typeof parsed?.url !== "string") {
    throw new Error("POST.json has no string `url` field");
  }
} catch (error) {
  console.error(`POST.json is not valid: ${(error as Error).message}`);
  process.exit(1);
}
