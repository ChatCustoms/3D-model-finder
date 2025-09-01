// routes/thingiverse.js
const express = require("express");
const axios = require("axios");

const router = express.Router();

// Simple ping
router.get("/ping", (_req, res) => res.send("ok-img"));

// Proxy image requests
router.get("/img", async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) return res.status(400).send("Missing url");

    const response = await axios.get(url, { responseType: "arraybuffer" });
    res.set("Content-Type", response.headers["content-type"]);
    res.set("Cache-Control", "public, max-age=86400, immutable");
    res.send(response.data);
  } catch (err) {
    res.status(500).send("Failed to fetch image");
  }
});

// Placeholder search (connect to Thingiverse API later)
router.get("/search", (req, res) => {
  res.json({ message: "Search route wired up!", query: req.query });
});

module.exports = router;
