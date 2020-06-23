const router = require("express").Router();
const { isLoggedInAuth } = require("../middleware/authMiddleware");
const {
  dashboardGetController,
  createProfileGetController,
  createProfilePostController,
  editProfileGetController,
  editProfilePostController
} = require("../controllers/dashboardController");

router.get("/", isLoggedInAuth, dashboardGetController);

router.get("/create-profile", isLoggedInAuth, createProfileGetController);
router.post("/create-profile", isLoggedInAuth, createProfilePostController);

router.get('/edit-profile', isLoggedInAuth, editProfileGetController)
router.post('/edit-profile', isLoggedInAuth, editProfilePostController)

module.exports = router;
