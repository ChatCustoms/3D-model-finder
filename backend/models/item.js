const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    externalId: { type: String, required: true, index: true }, // Thingiverse id
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    // optional metadata if you want to save/display later:
    title: String,
    previewImg: String,
    sourceUrl: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Item", itemSchema);
