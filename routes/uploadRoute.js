const router = require("express").Router();
const { isLoggedInAuth } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const {
  uploadProfilePics,
  removeProfilePics,
  postImageUploadController,
} = require("../controllers/uploadController");

router.post(
  "/profilePics",
  isLoggedInAuth,
  upload.single("profilePics"),
  uploadProfilePics
);

router.delete("/profilePics", isLoggedInAuth, removeProfilePics);

router.post(
  "/postimage",
  isLoggedInAuth,
  upload.single("post-image"),
  postImageUploadController
);

module.exports = router;
