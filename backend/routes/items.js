const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  likeByExternalId,
  unlikeByExternalId,
} = require("../controllers/likes");

router.post("/:externalId/likes", auth, likeByExternalId);
router.delete("/:externalId/likes", auth, unlikeByExternalId);

module.exports = router;
