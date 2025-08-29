const express = require("express");
const axios = require("axios");
const router = express.Router();

// Simple ping so we can test mounting
router.get("/ping", (_req, res) => res.type("text/plain").send("ok-img"));

// Image proxy (keeps images working cross-origin)
router.get("/img", async (req, res) => {
  try {
    const { url } = req.query;
    if (!url || !/^https?:\/\//i.test(url))
      return res.status(400).send("Missing or invalid url");

    const upstream = await axios.get(url, {
      responseType: "arraybuffer",
      timeout: 15000,
      maxRedirects: 5,
      validateStatus: (s) => s >= 200 && s < 400,
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
        Referer: "https://www.thingiverse.com/",
      },
    });

    const ct = (upstream.headers["content-type"] || "image/webp").toString();
    res.setHeader("Content-Type", ct);
    res.setHeader("Cache-Control", "public, max-age=86400, immutable");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    res.status(200).end(Buffer.from(upstream.data), "binary");
  } catch (err) {
    console.error("Image proxy error:", err?.response?.status || err.message);
    res.status(502).send("Image fetch failed");
  }
});

// Thingiverse search (this is the one the frontend calls)
router.get("/search", async (req, res) => {
  try {
    const { q, type = "things", page = 1 } = req.query;
    const r = await axios.get("https://api.thingiverse.com/search", {
      headers: {
        Authorization: `Bearer ${process.env.THINGIVERSE_ACCESS_TOKEN}`,
      },
      params: { q, type, page },
      timeout: 15000,
    });
    res.json(r.data);
  } catch (e) {
    console.error(
      "Thingiverse /search error:",
      e?.response?.status || e.message
    );
    const code = e?.response?.status === 401 ? 401 : 500;
    res.status(code).json({ error: "search failed" });
  }
});

module.exports = router;
