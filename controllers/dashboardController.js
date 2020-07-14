const Flash = require("../utils/Flash");
const Profile = require("../models/Profile");
const Comment = require('../models/Comment')
const { validationResult } = require("express-validator");
const User = require("../models/User");

exports.dashboardGetController = async (req, res, next) => {
  try {
    let profile = await Profile.findOne({
      user: req.user._id,
    })
      .populate({
        path: "posts",
        select: "title thumbnail",
      })
      .populate({
        path: "bookmarkes",
        select: "title thumbnail"
      });

    if (profile) {
      res.render("pages/dashboard/dashboard", {
        title: "my dashboard",
        flashMessage: Flash.getMessage(req),
        posts: profile.posts.reverse().slice(0, 3),
        bookmarks: profile.bookmarkes.reverse().slice(0, 3),
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
      error: {},
    });
  } catch (error) {
    next(error);
  }
};

exports.createProfilePostController = async (req, res, next) => {
  let errors = validationResult(req).formatWith((error) => error.msg);
  if (!errors.isEmpty()) {
    return res.render("pages/dashboard/createprofile", {
      title: "Edit your profile",
      flashMessage: Flash.getMessage(req),
      error: errors.mapped(),
    });
  }

  let { name, title, bio, website, facebook, twitter, github } = req.body;

  try {
    let profile = new Profile({
      user: req.user._id,
      name,
      title,
      bio,
      profilePics: req.user.profilePics,
      link: {
        website: website || "",
        facebook: facebook || "",
        twitter: twitter || "",
        github: github || "",
      },
      posts: [],
      bookmarkes: [],
    });

    let createdProfile = await profile.save();
    await User.findOneAndUpdate(
      {
        _id: req.user._id,
      },
      {
        $set: { profile: createdProfile._id },
      }
    );

    req.flash("success", "Profile Created Successfully");
    res.redirect("/dashboard");
  } catch (e) {
    next(e);
  }
};

exports.editProfileGetController = async (req, res, next) => {
  try {
    let profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res.redirect("/dashboard/create-profile");
    }

    res.render("pages/dashboard/editprofile", {
      title: "Edit your profile",
      error: {},
      flashMessage: Flash.getMessage(req),
      profile,
    });
  } catch (e) {
    next(e);
  }
};
exports.editProfilePostController = async (req, res, next) => {
  let errors = validationResult(req).formatWith((error) => error.msg);
  let { name, title, bio, website, facebook, twitter, github } = req.body;

  if (!errors.isEmpty()) {
    return res.render("pages/dashboard/editprofile", {
      title: "Edit you profile",
      error: errors.mapped(),
      flashMessage: Flash.getMessage(req),
      profile: {
        name,
        title,
        bio,
        link: {
          website,
          facebook,
          twitter,
          github,
        },
      },
    });
  }

  try {
    let updatedProfile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      {
        $set: {
          name,
          title,
          bio,
          link: {
            website,
            facebook,
            twitter,
            github,
          },
        },
      },
      {
        new: true,
      }
    );
    req.flash("success", "Profile Updated Successfully");
    res.render("pages/dashboard/editprofile", {
      title: "Edit your profile",
      error: {},
      flashMessage: Flash.getMessage(req),
      profile: updatedProfile,
    });
  } catch (e) {
    next(e);
  }
};

exports.bookmarksGetController = async (req, res, next) => {
  try {
    let bookmarks = await Profile.findOne({ user: req.user._id }).populate({
      path: "bookmarkes",
      model: "Post",
      select: "title thumbnail",
    });

    res.render("pages/dashboard/bookmarks", {
      title: "Bookmarked Post",
      flashMessage: Flash.getMessage(req),
      posts: bookmarks.bookmarkes,
    });
  } catch (e) {
    next(e);
  }
};

exports.commentsGetController = async (req, res, next) => {
  try {
    let profile = await Profile.findOne({ user: req.user._id });
    let comments = await Comment.find({ post: { $in: profile.posts } })
      .populate({
        path: "post",
        select: "title",
      })
      .populate({
        path: "user",
        select: "username profilePics",
      })
      .populate({
        path: "replies.user",
        select: 'username profilePics'
      });

    
    res.render('pages/dashboard/comment', {
      title: 'Recent Comment',
      comments,
    });
  } catch (e) {
    next(e);
  }
};
