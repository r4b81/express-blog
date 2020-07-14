const User = require("../models/User");
const bycrpt = require("bcrypt");
const { validationResult } = require("express-validator");
const Flash = require("../utils/Flash");

exports.signupGetController = (req, res, next) => {
  res.render("pages/auth/signup", {
    title: "Create A new Account",
    error: {},
    value: {},
    flashMessage: Flash.getMessage(req),
  });
};

exports.signupPostController = async (req, res, next) => {
  let { username, email, password } = req.body;
  let errors = validationResult(req).formatWith((error) => error.msg);
  if (!errors.isEmpty()) {
    req.flash("fail", "Please Check your form");
    return res.render("pages/auth/signup", {
      title: "Create A new Account",
      error: errors.mapped(),
      value: {
        username,
        email,
        password,
      },
      flashMessage: Flash.getMessage(req),
    });
  }

  try {
    let hashpassword = await bycrpt.hash(password, 11);
    let user = new User({
      username,
      email,
      password: hashpassword,
    });
    await user.save();
    req.flash("success", "Successfully registration complete");
    res.redirect("/auth/login");
  } catch (e) {
    next(e);
  }
};

exports.loginGetController = (req, res, next) => {
  console.log(req.session.isLoggedIn, req.session.user);

  res.render("pages/auth/login", {
    title: "login to your account",
    error: {},
    flashMessage: Flash.getMessage(req),
  });
};

exports.loginPostController = async (req, res, next) => {
  let { email, password } = req.body;

  let errors = validationResult(req).formatWith((error) => error.msg);
  if (!errors.isEmpty()) {
    req.flash("fail", "Please Check your form");
    return res.render("pages/auth/login", {
      title: "login to your account",
      error: errors.mapped(),
      flashMessage: Flash.getMessage(req),
    });
  }
  try {
    let user = await User.findOne({ email });
    if (!user) {
      req.flash("fail", "Please provide your valid email/password");
      return res.render("pages/auth/login", {
        title: "login to your account",
        error: {},
        flashMessage: Flash.getMessage(req),
      });
    }
    let matchPass = await bycrpt.compare(password, user.password);
    if (!matchPass) {
      req.flash("fail", "Please provide your valid email/password");
      return res.render("pages/auth/login", {
        title: "login to your account",
        error: {},
        flashMessage: Flash.getMessage(req),
      });
    }

    req.session.isLoggedIn = true;
    req.session.user = user;
    req.session.save((err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Successfully Logged In");
      res.redirect("/dashboard/");
    });
  } catch (e) {
    next(e);
  }
};

exports.logoutController = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/auth/login");
  });
};

exports.changePasswordGetController = async (req, res, next) => {
  res.render("pages/auth/changepassword", {
    title: "Change Password",
    flashMessage: Flash.getMessage(req),
    error: {},
  });
};

exports.changePasswordPostController = async (req, res, next) => {
  let { oldpassword, newpassword, confirmpassword } = req.body;
  let errors = validationResult(req).formatWith((error) => error.msg);
  console.log(errors);
  if (!errors.isEmpty()) {
    res.render("pages/auth/changepassword", {
      title: "Change Password",
      flashMessage: Flash.getMessage(req),
      error: errors.mapped(),
    });
  }
  try {
    let match = await bycrpt.compare(oldpassword, req.user.password);

    if (!match) {
      res.render("pages/auth/changepassword", {
        title: "Change Password",
        flashMessage: Flash.getMessage(req),
        error: errors.mapped(),
      });
    }

    let hash = await bycrpt.hash(confirmpassword, 11)

    await User.findOneAndUpdate({_id: req.user._id}, {
      $set: {password: hash}
    })

    req.flash('success', 'password change successfully')
    return res.redirect('/auth/change-password')
  } catch (e) {
    next(e);
  }
};
