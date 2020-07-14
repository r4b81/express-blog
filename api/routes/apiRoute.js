const router = require("express").Router();
const { isLoggedInAuth } = require("../../middleware/authMiddleware");
const {
  commentPostController,
  replyCommentGetController,
} = require("../controllers/commentController");
const {
  likesGetController,
  dislikeGetController,
} = require("../controllers/likeDisLikeController");
const {
  bookmarkesGetController,
} = require("../controllers/bookmarkController");

router.post("/comment/:postId", isLoggedInAuth, commentPostController);
router.post(
  "/comment/reply/:commentId",
  isLoggedInAuth,
  replyCommentGetController
);

router.get("/likes/:postId", isLoggedInAuth, likesGetController);
router.get("/dislikes/:postId", isLoggedInAuth, dislikeGetController);

router.get("/bookmarks/:postId", isLoggedInAuth, bookmarkesGetController);

module.exports = router;
