const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const User = require("../models/user");
const auth = require("../middlewares/auth");
const JWT_SECRET = process.env.JWT_SECRET;

// ---------- Thingiverse axios client ----------
const THINGIVERSE_TOKEN = process.env.THINGIVERSE_TOKEN || "";
const tv = axios.create({
  baseURL: "https://api.thingiverse.com",
  headers: THINGIVERSE_TOKEN
    ? { Authorization: `Bearer ${THINGIVERSE_TOKEN}` }
    : {},
  timeout: 15000,
});

// Sign up
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, avatarUrl } = req.body || {};
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "name, email, and password are required" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing)
      return res.status(409).json({ error: "Email is already registered" });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hash,
      avatarUrl: avatarUrl || "",
    });

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl || "",
      },
    });
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({ error: "Signup failed" });
  }
});

// Sign in
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );
    if (!user)
      return res.status(401).json({ error: "Invalid email or password" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok)
      return res.status(401).json({ error: "Invalid email or password" });

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl || "",
      },
    });
  } catch (err) {
    console.error("Signin error:", err.message);
    res.status(500).json({ error: "Signin failed" });
  }
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
