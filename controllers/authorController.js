const Profile = require("../models/Profile");

exports.authorProfileGetController = async (req, res, next) => {
  let { userId } = req.params;

  try {
    let author = await Profile.findOne({user: userId}).populate('posts')
    res.render("pages/explorer/author", {
      title: "Author Page",
      author
    });
  } catch (e) {
    next(e);
  }
};
