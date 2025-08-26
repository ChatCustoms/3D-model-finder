// backend/app.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const routes = require("./routes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.set("trust proxy", 1); // behind nginx
app.use(helmet()); // sensible security headers
app.use(express.json({ limit: "1mb" })); // optional size cap

// Build allow-list from env
const envList = [
  process.env.CLIENT_ORIGIN,
  ...(process.env.EXTRA_CLIENT_ORIGINS
    ? process.env.EXTRA_CLIENT_ORIGINS.split(",")
    : []),
].filter(Boolean);

const allowedOrigins = new Set(envList);

// CORS: allow dev tools (no Origin) and exact matches
const corsOptions = {
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // curl/Postman
    if (allowedOrigins.has(origin)) return cb(null, true);
    return cb(new Error(`CORS not allowed for origin: ${origin}`));
  },
  credentials: true,
};

// Preflight first so failures are clear
app.options("*", cors(corsOptions));
app.use(cors(corsOptions));

// Health
app.get("/health", (_req, res) => res.status(200).send("ok"));

// API
app.use("/api", routes);

// Errors last
app.use(errorHandler);

module.exports = app;
