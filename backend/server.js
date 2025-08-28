require("dotenv").config();
const mongoose = require("mongoose");
const http = require("http");
const app = require("./app");

const PORT = process.env.PORT || 3001;
const { MONGODB_URI } = process.env;

if (!MONGODB_URI) {
  console.error("Missing MONGODB_URI in .env");
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
    const server = http.createServer(app);
    server.listen(PORT, () => console.log(`API listening on ${PORT}`));
  })
  .catch((err) => {
    console.error("Mongo connection error:", err.message);
    process.exit(1);
  });
