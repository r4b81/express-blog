const router = require("express").Router();
const signupValidation = require("../validator/auth/signupvalidator");
const loginValidation = require("../validator/auth/loginvalidator");
const changePasswordValidation = require("../validator/auth/changePasswordValidator");
const {
  signupGetController,
  signupPostController,
  loginGetController,
  loginPostController,
  logoutController,
  changePasswordGetController,
  changePasswordPostController,
} = require("../controllers/authController");
const { forLoggedIn, isLoggedInAuth } = require("../middleware/authMiddleware");

router.get("/signup", forLoggedIn, signupGetController);
router.post("/signup", signupValidation, signupPostController);
router.get("/login", forLoggedIn, loginGetController);
router.post("/login", loginValidation, loginPostController);
router.get("/logout", logoutController);
router.get("/change-password", isLoggedInAuth, changePasswordGetController);
router.post(
  "/change-password",
  isLoggedInAuth,
  changePasswordValidation,
  changePasswordPostController
);

module.exports = router;
