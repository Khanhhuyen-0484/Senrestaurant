import { cp, mkdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";

const dist = new URL("./dist/", import.meta.url);
const entries = [
  "index.html",
  "about.html",
  "menu.html",
  "space.html",
  "styles.css",
  "script.js",
  "assets"
];

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

for (const entry of entries) {
  if (existsSync(new URL(entry, import.meta.url))) {
    await cp(new URL(entry, import.meta.url), new URL(`./dist/${entry}`, import.meta.url), {
      recursive: true
    });
  }
}
