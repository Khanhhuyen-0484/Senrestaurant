import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";

const dist = new URL("./dist/", import.meta.url);
const server = new URL("./dist/server/", import.meta.url);
const entries = [
  "index.html",
  "about.html",
  "menu.html",
  "space.html",
  "styles.css",
  "script.js",
  "assets",
  ".openai"
];

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await mkdir(server, { recursive: true });

for (const entry of entries) {
  if (existsSync(new URL(entry, import.meta.url))) {
    await cp(new URL(entry, import.meta.url), new URL(`./dist/${entry}`, import.meta.url), {
      recursive: true
    });
  }
}

await writeFile(
  new URL("./dist/server/index.js", import.meta.url),
  `export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname === "/" ? "/index.html" : url.pathname;
    const assetUrl = new URL(request.url);
    assetUrl.pathname = pathname.includes(".") ? pathname : \`\${pathname}.html\`;

    const response = await env.ASSETS.fetch(new Request(assetUrl, request));
    if (response.status !== 404) {
      return response;
    }

    const fallbackUrl = new URL(request.url);
    fallbackUrl.pathname = "/index.html";
    return env.ASSETS.fetch(new Request(fallbackUrl, request));
  }
};
`
);
