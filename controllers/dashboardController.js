const Flash = require("../utils/Flash");
const Profile = require("../models/Profile");

exports.dashboardGetController = async (req, res, next) => {
  try {
    let profile = await Profile.findOne({
      user: req.user._id,
    });

    if (profile) {
      res.render("pages/dashboard/dashboard", {
        title: "my dashboard",
        flashMessage: Flash.getMessage(req),
      });
    } else {
      res.redirect("/dashboard/create-profile");
    }
  } catch (error) {
    next(error);
  }
};

exports.createProfileGetController = async (req, res, next) => {
  try {
    let profile = await Profile.findOne({ user: req.user._id });
    if (profile) {
      return res.redirect("/dashboard/edit-profile");
    }

    res.render("pages/dashboard/createprofile", {
      title: "Edit your profile",
      flashMessage: Flash.getMessage(req),
    });

  } catch (error) {
    next(error);
  }
};

exports.createProfilePostController = (req, res, next) => {
  next()
}
exports.editProfileGetController = (req, res, next) => {
  next()
}
exports.editProfilePostController = (req, res, next) => {
  next()
}