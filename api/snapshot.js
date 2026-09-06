const { poolSnapshot } = require("../lib/snapshot");
module.exports = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET") {
    res.statusCode = 405;
    return res.end(JSON.stringify({ error: "GET required." }));
  }
  try {
    res.end(JSON.stringify(await poolSnapshot()));
  } catch {
    res.statusCode = 503;
    res.end(
      JSON.stringify({
        error:
          "Live BSC pool data is unavailable. Retry or use your own price.",
      }),
    );
  }
};
