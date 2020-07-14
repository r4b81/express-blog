const { body } = require("express-validator");
const User = require("../../models/User");
const bcrypt = require("bcrypt");

module.exports = [
  body("oldpassword")
    .not()
    .isEmpty()
    .withMessage("Please provaid Old Password")
    .custom(async (oldpassword, { req }) => {
      let user = await User.findById(req.user._id);
      if (user) {
        let match = await bcrypt.compare(oldpassword, req.user.password);
        if (!match) {
          throw new Error("Old Password Does not Match");
        }
      }
      return true;
    }),
  body("newpassword")
    .not()
    .isEmpty()
    .withMessage("Please provaid New Password")
    .isLength({ min: 6 })
    .withMessage("new password must be grater then 6 character"),
  body("confirmpassword")
    .not()
    .isEmpty()
    .withMessage("Please Confirm Your New Password")
    .custom((confirmpassword, {req})=> {
      if (confirmpassword !== req.body.newpassword) {
        throw new Error('Confirm Password not match with new password')
      }
      return true
    }),
];
