// routes/index.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const User = require("../models/user");
const auth = require("../middlewares/auth");
const {
  likeByExternalId,
  unlikeByExternalId,
} = require("../controllers/likes");

// ---------- Auth & Users ----------
router.post("/signup", async (req, res) => {
  const { name, avatar, email, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, avatar, email, password: hash });
    res.status(201).send({
      name: user.name,
      avatar: user.avatar,
      email: user.email,
      _id: user._id,
    });
  } catch (err) {
    res
      .status(400)
      .send({ message: "User creation failed", error: err.message });
  }
});

// ---------- Likes (by external Thingiverse id) ----------
router.post("/items/:externalId/likes", auth, likeByExternalId);
router.delete("/items/:externalId/likes", auth, unlikeByExternalId);

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.send({ token });
  } catch (_err) {
    res.status(401).send({ message: "Login failed" });
  }
});

router.get("/users/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).send({ message: "User not found" });
  res.send(user);
});

router.patch("/users/me", auth, async (req, res) => {
  const { name, avatar } = req.body;
  try {
    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { name, avatar },
      { new: true, runValidators: true }
    );
    res.send(updated);
  } catch (_err) {
    res.status(400).send({ message: "Update failed" });
  }
});

router.get("/test", (_req, res) => res.send("Test route v2 works!"));

router.get("/thingiverse/ping", (_req, res) => {
  res.type("text/plain").send("ok-img");
});

// ---------- Thingiverse search proxy ----------
router.get("/api/thingiverse/search", async (req, res) => {
  try {
    const { q, type = "things", page = 1 } = req.query;
    if (!q) return res.status(400).json({ message: "Missing query param q" });

    const accessToken = process.env.THINGIVERSE_TOKEN;
    if (!accessToken) {
      return res
        .status(500)
        .json({ message: "Missing THINGIVERSE_TOKEN on server" });
    }

    const resp = await axios.get(
      `https://api.thingiverse.com/search/${encodeURIComponent(q)}`,
      {
        params: { type, page, access_token: accessToken },
        headers: { Accept: "application/json" },
        timeout: 10000,
      }
    );

    res.status(200).json(resp.data);
  } catch (err) {
    const status = err.response?.status || 500;
    const data = err.response?.data || {
      message: err.message || "Thingiverse proxy error",
    };
    res.status(status).json(data);
  }
});

// ---------- Thing details ----------
router.get("/api/thingiverse/things/:id", async (req, res) => {
  try {
    const accessToken = process.env.THINGIVERSE_TOKEN;
    if (!accessToken) {
      return res
        .status(500)
        .json({ message: "Missing THINGIVERSE_TOKEN on server" });
    }

    const resp = await axios.get(
      `https://api.thingiverse.com/things/${encodeURIComponent(req.params.id)}`,
      {
        params: { access_token: accessToken },
        headers: { Accept: "application/json" },
        timeout: 10000,
      }
    );

    res.status(200).json(resp.data);
  } catch (err) {
    const status = err.response?.status || 500;
    const data = err.response?.data || {
      message: err.message || "Thingiverse proxy error",
    };
    res.status(status).json(data);
  }
});

router.get("api/thingiverse/img", async (req, res) => {
  try {
    const { url } = req.query;
    console.log("IMG PROXY HIT:", url);

    if (!url || !/^https?:\/\//i.test(url)) {
      return res.status(400).send("Missing or invalid url");
    }

    const upstream = await axios.get(url, {
      responseType: "arraybuffer",
      timeout: 15000,
      maxRedirects: 5,
      validateStatus: (s) => s >= 200 && s < 400,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36",
        Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
        Referer: "https://www.thingiverse.com/",
      },
    });

    const ct = (upstream.headers["content-type"] || "image/jpeg").toString();

    res.setHeader("Content-Type", ct);
    res.setHeader("Cache-Control", "public, max-age=86400, immutable");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    res.setHeader("Access-Control-Allow-Origin", "*");

    res.status(200).end(Buffer.from(upstream.data), "binary");
  } catch (err) {
    console.error("Image proxy error:", err?.response?.status || err.message);
    res.status(502).send("Image fetch failed");
  }
});

// (Optional) Debug helpers you used during setup:
router.get("/thingiverse/debug-token", (_req, res) => {
  res.json({ hasToken: !!process.env.THINGIVERSE_TOKEN });
});

router.get("/thingiverse/debug-curl", async (_req, res) => {
  try {
    const accessToken = process.env.THINGIVERSE_TOKEN;
    if (!accessToken)
      return res.status(500).json({ message: "Missing THINGIVERSE_TOKEN" });
    const r = await axios.get("https://api.thingiverse.com/search/car/", {
      params: { type: "things", page: 1, access_token: accessToken },
      timeout: 10000,
    });
    res.json({
      ok: true,
      status: r.status,
      hits: Array.isArray(r.data?.hits) ? r.data.hits.length : null,
    });
  } catch (e) {
    res.status(e.response?.status || 500).json({
      ok: false,
      status: e.response?.status || 500,
      data: e.response?.data || e.message,
    });
  }
});

module.exports = router;
