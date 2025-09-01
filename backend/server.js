// server.js
require("dotenv").config();
const app = require("./app");
const mongoose = require("mongoose");

const PORT = Number(process.env.PORT) || 3001;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Missing MONGODB_URI in .env");
  process.exit(1);
}

let server;

async function start() {
  try {
    // Connect to MongoDB first
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected");

    // Then start the HTTP server
    server = app.listen(PORT, () => {
      console.log(`API listening on ${PORT}`);
    });

    // Helpful timeouts for proxies/load balancers
    server.keepAliveTimeout = 65_000; // keep-alive sockets
    server.headersTimeout = 66_000; // must be > keepAliveTimeout
  } catch (err) {
    console.error("Mongo connection error:", err.message);
    process.exit(1);
  }
}

start();

// Graceful shutdown
async function shutdown(exitCode = 0) {
  try {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
    if (mongoose.connection.readyState) {
      await mongoose.disconnect();
    }
  } catch (e) {
    console.error("Error during shutdown:", e);
    exitCode = exitCode || 1;
  } finally {
    process.exit(exitCode);
  }
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled promise rejection:", reason);
  shutdown(1);
});
process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
  shutdown(1);
});
