const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const auth = require("../middlewares/auth");


// Register
router.post("/signup", async (req, res) => {
  const { name, avatar, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({ name, avatar, email, password: hash });
    res
      .status(201)
      .send({
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

module.exports = router;
