cat > server.js <<'EOF'
require("dotenv").config();
const mongoose = require("mongoose");
const http = require("http");
const app = require("./app");

const PORT = process.env.PORT || 3001;
const { MONGODB_URI } = process.env;

console.log("[BOOT] NODE_ENV:", process.env.NODE_ENV);
console.log("[BOOT] PORT:", PORT);
console.log("[BOOT] CLIENT_ORIGIN:", process.env.CLIENT_ORIGIN);
console.log("[BOOT] Have THINGIVERSE_TOKEN:", !!process.env.THINGIVERSE_TOKEN);
console.log("[BOOT] MONGODB_URI present:", !!MONGODB_URI);

if (!MONGODB_URI) {
  console.error("❌ Missing MONGODB_URI in .env");
  process.exit(1);
}

// Helpful in modern Mongoose
mongoose.set("strictQuery", true);

// add very explicit diagnostics
mongoose.connection.on("connecting", () => console.log("🟡 MongoDB connecting..."));
mongoose.connection.on("connected",  () => console.log("🟢 MongoDB connected"));
mongoose.connection.on("disconnected", () => console.log("🟠 MongoDB disconnected"));
mongoose.connection.on("error", (err) => console.error("🔴 MongoDB error:", err.message));

(async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,   // fail fast with a clear error
      socketTimeoutMS: 20000,
      retryWrites: true,
      tls: true,                         // Atlas requires TLS
    });

    const server = http.createServer(app);
    server.listen(PORT, () => console.log(`✅ API listening on ${PORT}`));
  } catch (err) {
    console.error("❌ Mongo connection error:", err.message);
    process.exit(1);
  }
})();
EOF