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

router.get("/test", (req, res) => {
  res.send("Test route works!");
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

module.exports = router;
