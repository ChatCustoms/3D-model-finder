const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("./routes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();
app.use(cors());
app.use(express.json());
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(routes);
app.use(errorHandler);

module.exports = app;
