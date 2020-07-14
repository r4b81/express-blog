const router = require("express").Router();
const {
  createPostGetController,
  createPostPostController,
  editPostGetController,
  editPostPostController,
  deletePostController,
  postGetController
} = require("../controllers/postController");
const { isLoggedInAuth } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const postValidator = require("../validator/dashboard/postValidator");

router.get("/create", isLoggedInAuth, createPostGetController);
router.post(
  "/create",
  isLoggedInAuth,
  upload.single("thumbnail"),
  postValidator,
  createPostPostController
);
router.get("/edit/:postId", isLoggedInAuth, editPostGetController);
router.post(
  "/edit/:postId",
  isLoggedInAuth,
  upload.single("thumbnail"),
  postValidator,
  editPostPostController
);

router.get("/delete/:postId", isLoggedInAuth, deletePostController);

router.get('/', isLoggedInAuth, postGetController)

module.exports = router;
