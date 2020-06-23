const { body } = require("express-validator");

module.exports = [
  body("email")
    .not()
    .isEmpty()
    .normalizeEmail()
    .isEmail()
    .withMessage("Invalid Email/Password Address"),
  body("password")
    .not()
    .isEmpty()
    .withMessage("Invalid Email/Password Address"),
];
