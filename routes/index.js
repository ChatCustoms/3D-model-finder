const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const User = require("../models/user");
const auth = require("../middlewares/auth");

// ---------- Thingiverse axios client ----------
const THINGIVERSE_TOKEN = process.env.THINGIVERSE_TOKEN || "";
const tv = axios.create({
  baseURL: "https://api.thingiverse.com",
  headers: THINGIVERSE_TOKEN
    ? { Authorization: `Bearer ${THINGIVERSE_TOKEN}` }
    : {},
  timeout: 15000,
});

// --- Test (V2) ---
router.get("/test", (_req, res) => {
  res.send("Test route V2 works!");
});

// --- Thingiverse ping (debug) ---
router.get("/thingiverse/ping", (_req, res) => {
  res.type("text/plain").send("ok-img");
});

// --- Thingiverse image proxy ---
router.get("/thingiverse/img", async (req, res) => {
  try {
    const { url } = req.query;
    if (!url || !/^https?:\/\//i.test(url)) {
      return res.status(400).send("Missing or invalid url");
    }

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

    const ct = (upstream.headers["content-type"] || "image/jpeg").toString();
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

// --- Thingiverse search ---
// /api/thingiverse/search?q=car&type=things&page=1
router.get("/thingiverse/search", async (req, res) => {
  try {
    const { q = "", type = "things", page = 1 } = req.query;
    const r = await tv.get("/search", { params: { q, type, page } });
    res.json(r.data);
  } catch (err) {
    const status = err?.response?.status || 502;
    console.error("Thingiverse /search error:", status, err.message);
    res.status(502).json({ error: "search failed" });
  }
});

// --- Thingiverse thing details ---
// /api/thingiverse/things/:id
router.get("/thingiverse/things/:id", async (req, res) => {
  try {
    const id = encodeURIComponent(req.params.id);
    const r = await tv.get(`/things/${id}`);
    res.json(r.data);
  } catch (err) {
    const status = err?.response?.status || 502;
    console.error("Thingiverse /things/:id error:", status, err.message);
    res.status(502).json({ error: "thing fetch failed" });
  }
});

module.exports = router;
