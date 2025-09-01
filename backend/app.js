// app.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const routes = require("./routes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.set("trust proxy", 1);
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(express.json());

// CORS allow-list
const allowedOrigins = [
  process.env.CLIENT_ORIGIN, // prod frontend (Netlify)
  "http://localhost:5173",
  "http://127.0.0.1:5173",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return cb(null, true);
      }
      return cb(new Error("CORS not allowed"));
    },
    credentials: true,
  })
);

// Health check
app.get("/health", (_req, res) => res.status(200).send("ok"));

// Mount API under /api
app.use("/api", routes);

// Error handler last
app.use(errorHandler);

module.exports = app;
