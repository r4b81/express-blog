const Profile = require("../../models/Profile");

exports.bookmarkesGetController = async (req, res, next) => {
  let { postId } = req.params;

  if (!req.user) {
    return res.status(403).json({
      error: "your are not an athenticated user",
    });
  }
  let userId = req.user._id;
  let bookmarked = null;
  try {
    let profile = await Profile.findOne({ user: userId });
    if (profile.bookmarkes.includes(postId)) {
      await Profile.findOneAndUpdate(
        { user: userId },
        { $pull: { bookmarkes: postId } }
      );
      bookmarked = false;
    } else {
      await Profile.findOneAndUpdate(
        { user: userId },
        { $push: { bookmarkes: postId } }
      );
      bookmarked = true;
    }

    res.status(200).json({
      bookmarked,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "server error occurred",
    });
  }
};
