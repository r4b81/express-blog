const Post = require("../../models/Post");
const Comment = require("../../models/Comment");

exports.commentPostController = async (req, res, next) => {
  let { postId } = req.params;
  let { body } = req.body;

  if (!req.user) {
    return res.status(403).json({
      error: "your are not an athenticated user",
    });
  }
  let userId = req.user._id;
  let comment = new Comment({
    post: postId,
    user: userId,
    body,
    replied: [],
  });

  try {
    let createdComment = await comment.save();
    await Post.findOneAndUpdate(
      { _id: postId },
      { $push: { comments: createdComment._id } }
    );

    let commentJSON = await Comment.findById(createdComment._id).populate({
      path: "user",
      select: "profilePics",
    });

    return res.status(201).json(commentJSON);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "server error occurred",
    });
  }
};

exports.replyCommentGetController = async (req, res, next) => {
  let { commentId } = req.params;
  let { body } = req.body;

  if (!req.user) {
    return res.status(403).json({
      error: "your are not an athenticated user",
    });
  }

  let reply = {
    body,
    user: req.user._id,
  };

  try {
    await Comment.findOneAndUpdate(
      { _id: commentId },
      { $push: { replies: reply } }
    );

    let profilePics = req.user.profilePics
    
    return res.status(201).json({
      ...reply,
      profilePics,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "server error occurred",
    });
  }
};
