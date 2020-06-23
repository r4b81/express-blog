const fs = require("fs");
const User = require("../models/User");
const Profile = require("../models/Profile");


exports.uploadProfilePics = async (req, res, next) => {
  if (req.file) {
    try {
      let profile = await Profile.findOne({ user: req.user._id });
      let profilePics = `/uploads/${req.file.filename}`;

      if (profile) {
        await Profile.findOneAndUpdate(
          { user: req.user._id },
          { $set: { profilePics } }
        );
      }

      await User.findOneAndUpdate(
        { _id: req.user._id },
        { $set: { profilePics } }
      );

      res.status(200).json({
        profilePics,
      });
    } catch (error) {
      res.status(500).json({
        profilePics: req.user.profilePics,
      });
    }
  } else {
    res.status(500).json({
      profilePics: req.user.profilePics,
    });
  }
};

exports.removeProfilePics = (req, res, next) => {
  let defaultProfile = "/uploads/default.png";
  let currentProfilePics = req.user.profilePics;

  fs.unlink(`public${currentProfilePics}`, async (err) => {
    try {
      let profile = await Profile.findOne({ user: req.user._id });
      if (profile) {
        await Profile.findOneAndUpdate(
          { user: req.user._id },
          { $set: { profilePics: defaultProfile } }
        );
      }

      await User.findOneAndUpdate(
        { _id: req.user._id },
        { $set: { profilePics: defaultProfile } }
      );
      
    } catch (e) {
      console.log(e);
      res.status(500).json({
        message: "Can not Remove Profile Pics",
      });
    }
  });
  res.json({
    profilePics: defaultProfile,
  });
};
