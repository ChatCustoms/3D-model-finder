// backend/app.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");

const routes = require("./routes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

// If you're behind Nginx on GCP, this helps with IPs/cookies
app.set("trust proxy", 1);

// Security headers + JSON parsing
app.use(helmet());
app.use(express.json());

// CORS: restrict to your deployed frontend
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:3000";
app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true, // keep true if you ever use cookies; safe otherwise
  })
);

// --- Health check (for quick tests & uptime monitors) ---
app.get("/health", (_req, res) => res.status(200).send("ok"));

// --- DB connect (one-time) ---
const { MONGODB_URI } = process.env;
if (!MONGODB_URI) {
  console.error("Missing MONGODB_URI in environment");
  process.exit(1);
}
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("Mongo connection error:", err.message);
    process.exit(1);
  });

// --- API routes ---
app.use(routes);

// --- Error handler MUST be last ---
app.use(errorHandler);

module.exports = app;
