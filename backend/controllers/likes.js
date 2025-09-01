const Item = require("../models/item");

exports.likeByExternalId = async (req, res, next) => {
  try {
    const { externalId } = req.params;
    const userId = req.user._id;

    // Ensure item exists (or create)
    const item = await Item.findOneAndUpdate(
      { externalId },
      { $setOnInsert: { externalId } },
      { upsert: true, new: true }
    );

    // Add user to likedBy
    await Item.updateOne({ _id: item._id }, { $addToSet: { likedBy: userId } });

    const updated = await Item.findById(item._id).lean();
    return res.status(200).send(updated);
  } catch (err) {
    next(err);
  }
};

exports.unlikeByExternalId = async (req, res, next) => {
  try {
    const { externalId } = req.params;
    const userId = req.user._id;

    const item = await Item.findOne({ externalId });
    if (!item) return res.status(200).send({}); // no-op

    await Item.updateOne({ _id: item._id }, { $pull: { likedBy: userId } });

    const updated = await Item.findById(item._id).lean();
    return res.status(200).send(updated ?? {});
  } catch (err) {
    next(err);
  }
};
