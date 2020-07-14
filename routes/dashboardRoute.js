const router = require("express").Router();
const { isLoggedInAuth } = require("../middleware/authMiddleware");
const profileValidator = require('../validator/dashboard/profileValidator')
const {
  dashboardGetController,
  createProfileGetController,
  createProfilePostController,
  editProfileGetController,
  editProfilePostController,
  bookmarksGetController,
  commentsGetController,
} = require("../controllers/dashboardController");

router.get('/bookmarks', isLoggedInAuth, bookmarksGetController)
router.get('/comments', isLoggedInAuth, commentsGetController)

router.get("/create-profile", isLoggedInAuth, createProfileGetController);
router.post("/create-profile", isLoggedInAuth, profileValidator, createProfilePostController);

router.get("/edit-profile", isLoggedInAuth, editProfileGetController);
router.post("/edit-profile", isLoggedInAuth, profileValidator, editProfilePostController);

router.get("/", isLoggedInAuth, dashboardGetController);
module.exports = router;
