// routes/index.js
const express = require("express");
const router = express.Router();
const axios = require("axios");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

// ---------- TEST ----------
router.get("/test", (_req, res) => {
  res.send("Test route V2 works!");
});

// ---------- THINGIVERSE: ping ----------
router.get("/thingiverse/ping", (_req, res) => {
  res.type("text/plain").send("ok-img");
});

// ---------- THINGIVERSE: image proxy ----------
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

// ---------- AUTH ----------
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, avatarUrl, avatar } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Missing name, email or password" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hash,
      // 👇 satisfy the schema's required `avatar`
      avatar: avatar ?? avatarUrl ?? "",
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatar, // keep naming consistent for the client
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    if (err?.code === 11000)
      return res.status(409).json({ error: "Email already registered" });
    if (err?.name === "ValidationError")
      return res.status(400).json({ error: err.message });
    return res.status(500).json({ error: "Signup failed" });
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

module.exports = router;
