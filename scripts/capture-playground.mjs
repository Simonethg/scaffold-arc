/**
 * Captures playground screenshots for the README.
 * Requires: yarn nextjs:dev running on :3000, and `npx playwright install chromium` once.
 */
import { chromium } from "playwright";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "docs/screenshots");
fs.mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
const desk = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await desk.goto("http://localhost:3000", { waitUntil: "networkidle" });
await desk.screenshot({
  path: path.join(out, "playground-usdc-desktop.png"),
  fullPage: true,
});

const mob = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mob.goto("http://localhost:3000", { waitUntil: "networkidle" });
await mob.screenshot({
  path: path.join(out, "playground-usdc-mobile.png"),
  fullPage: true,
});

await browser.close();
console.log("Wrote playground-usdc-desktop.png and playground-usdc-mobile.png");
