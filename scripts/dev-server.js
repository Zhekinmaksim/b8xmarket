const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { handleAgent } = require("../lib/b8x-agent");
const snapshot = require("../api/snapshot");
const root = path.resolve(__dirname, "..");
const publicFiles = new Set([
  "index.html",
  "analysis.html",
  "app.css",
  "app.js",
  "catalog.js",
  "favicon.svg",
  "favicon-32.png",
  "apple-touch-icon.png",
  "og.png",
  "robots.txt",
  "sitemap.xml",
  "social-card.html",
]);
const mime = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".md": "text/plain",
};
http
  .createServer(async (req, res) => {
    const url = new URL(req.url, "http://localhost");
    try {
      if (req.method === "POST") {
        let body = "";
        for await (const chunk of req) {
          body += chunk;
          if (Buffer.byteLength(body) > 32768) {
            res.writeHead(413);
            res.end("Body too large");
            return;
          }
        }
        req.body = body;
      }
      const match = url.pathname.match(
        /^\/api\/agents\/(b8xrebal|b8xgrid|b8xyield|b8xhealth)(?:\/a2a|\/\.well-known\/agent-card\.json)?$/,
      );
      if (match) return await handleAgent(req, res, match[1]);
      if (url.pathname === "/api/snapshot") return await snapshot(req, res);
      const relative =
        url.pathname === "/" ? "index.html" : url.pathname.slice(1);
      if (
        !publicFiles.has(relative) &&
        !/^docs\/[a-zA-Z0-9_./-]+\.(md|json)$/.test(relative)
      ) {
        res.writeHead(404);
        return res.end("Not found");
      }
      const file = path.resolve(root, relative === "social-card.html" ? "scripts/social-card.html" : relative);
      if (
        !file.startsWith(root + path.sep) ||
        !fs.existsSync(file) ||
        !fs.statSync(file).isFile()
      ) {
        res.writeHead(404);
        return res.end("Not found");
      }
      res.setHeader("Content-Type", mime[path.extname(file)] || "text/plain");
      res.setHeader("Cache-Control", "no-store");
      fs.createReadStream(file).pipe(res);
    } catch {
      res.writeHead(500);
      res.end("Request failed");
    }
  })
  .listen(Number(process.env.PORT || 4173), "127.0.0.1", () =>
    console.log(`B8X http://127.0.0.1:${process.env.PORT || 4173}`),
  );
