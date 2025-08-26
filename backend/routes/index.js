const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const auth = require("../middlewares/auth");
const axios = require("axios");

// Register
router.post("/signup", async (req, res) => {
  const { name, avatar, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  try {
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

// Login
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.send({ token });
  } catch (err) {
    res.status(401).send({ message: "Login failed" });
  }
});

// Get user profile
router.get("/users/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).send({ message: "User not found" });
  res.send(user);
});

router.get("/test", (req, res) => res.send("Test route works!"));

router.get("/thingiverse/debug-token", (req, res) => {
  const present = !!process.env.THINGIVERSE_TOKEN;
  res.json({ hasToken: present });
});

// Update profile
router.patch("/users/me", auth, async (req, res) => {
  const { name, avatar } = req.body;
  try {
    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { name, avatar },
      { new: true, runValidators: true }
    );
    res.send(updated);
  } catch (err) {
    res.status(400).send({ message: "Update failed" });
  }
});

router.get("/thingiverse/search", async (req, res) => {
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
        params: {
          type,
          page,
          access_token: accessToken, // <-- use query param style
        },
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

router.get("/thingiverse/things/:id", async (req, res) => {
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
        params: { access_token: accessToken }, // query-param style works (you confirmed via curl)
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

router.get("/thingiverse/img", async (req, res) => {
  try {
    const { url } = req.query;
    if (!url || !/^https?:\/\/.+/i.test(url)) {
      return res.status(400).send("Missing or invalid url");
    }

    const upstream = await axios.get(url, {
      responseType: "stream",
      // Pretend to be a normal browser
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123 Safari/537.36",
        Referer: "https://www.thingiverse.com/",
        Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
      },
      timeout: 15000,
      validateStatus: (s) => s >= 200 && s < 400, // follow redirects via axios
      maxRedirects: 3,
    });

    // Pass through content type & length if present
    if (upstream.headers["content-type"])
      res.setHeader("Content-Type", upstream.headers["content-type"]);
    if (upstream.headers["content-length"])
      res.setHeader("Content-Length", upstream.headers["content-length"]);
    res.setHeader("Cache-Control", "public, max-age=86400");

    upstream.data.pipe(res);
  } catch (err) {
    const status = err.response?.status || 502;
    res.status(status).send("Image proxy error");
  }
});

module.exports = router;
