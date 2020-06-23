const router = require("express").Router();
const signupValidation = require("../validator/auth/signupvalidator");
const loginValidation = require("../validator/auth/loginvalidator");
const {
  signupGetController,
  signupPostController,
  loginGetController,
  loginPostController,
  logoutController,
} = require("../controllers/authController");
const { forLoggedIn } = require("../middleware/authMiddleware");

router.get("/signup", forLoggedIn, signupGetController);
router.post("/signup", signupValidation, signupPostController);
router.get("/login", forLoggedIn, loginGetController);
router.post("/login", loginValidation, loginPostController);
router.get("/logout", logoutController);

module.exports = router;
