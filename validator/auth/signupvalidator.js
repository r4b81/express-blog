const { body } = require("express-validator");
const User = require("../../models/User");

module.exports = [
  body("username")
    .isLength({ min: 5 })
    .withMessage("Username must be greater then 5 character")
    .custom(async (username) => {
      let user = await User.findOne({ username });
      if (user) {
        return Promise.reject("Username Already in Used");
      }
    }),
  body("email")
    .isEmail()
    .withMessage("Please Provide a valid email address")
    .custom(async (email) => {
      let user = await User.findOne({ email });
      if (user) {
        return Promise.reject("Email Already Registared");
      }
    }),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be greater then 5 character"),
  body("confirmPassword").custom((confirmPassword, { req }) => {
    if (confirmPassword !== req.body.password) {
      throw new Error("Confirm Password Not match");
    }
    return true;
  }),
];