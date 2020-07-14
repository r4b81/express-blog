const { validationResult } = require("express-validator");
const Flash = require("../utils/Flash");
const readingTime = require("reading-time");
const Post = require("../models/Post");
const Profile = require("../models/Profile");

exports.createPostGetController = (req, res, next) => {
  res.render("pages/dashboard/post/createpost", {
    title: "Create a new Post",
    error: {},
    flashMessage: Flash.getMessage(req),
    value: {},
  });
};

exports.createPostPostController = async (req, res, next) => {
  let { title, body, tags } = req.body;
  let errors = validationResult(req).formatWith((error) => error.msg);

  if (!errors.isEmpty()) {
    return res.render("pages/dashboard/post/createpost", {
      title: "Create a new Post",
      error: errors.mapped(),
      flashMessage: Flash.getMessage(req),
      value: {
        title,
        body,
        tags,
      },
    });
  }

  if (tags) {
    tags = tags.split(",");
    tags = tags.map((tag) => tag.trim());
  }

  let readTime = readingTime(body).text;

  let post = new Post({
    title,
    body,
    author: req.user._id,
    tags,
    thumbnail: "",
    readTime,
    likes: [],
    dislikes: [],
    comments: [],
  });

  if (req.file) {
    post.thumbnail = `/uploads/${req.file.filename}`;
  }

  try {
    let createPost = await post.save();
    await Profile.findOneAndUpdate(
      { user: req.user._id },
      {
        $push: { posts: createPost._id },
      }
    );
    req.flash("success", "Post Created Successfully");
    return res.redirect(`/posts/edit/${createPost._id}`);
  } catch (e) {
    next(e);
  }
};

exports.editPostGetController = async (req, res, next) => {
  let postId = req.params.postId;

  try {
    let post = await Post.findOne({ author: req.user._id, _id: postId });

    if (!post) {
      let error = new Error("404 page not found");
      error.status = 404;
      throw error;
    }
    res.render("pages/dashboard/post/editpost", {
      title: "Edit your post",
      error: {},
      flashMessage: Flash.getMessage(req),
      post,
    });
  } catch (e) {
    next(e);
  }
};

exports.editPostPostController = async (req, res, next) => {
  let { title, body, tags } = req.body;
  let postId = req.params.postId;
  let errors = validationResult(req).formatWith((error) => error.msg);

  try {
    let post = await Post.findOne({ author: req.user._id, _id: postId });

    if (!post) {
      let error = new Error("404 page not found");
      error.status = 404;
      throw error;
    }

    if (!errors.isEmpty()) {
      return res.render("pages/dashboard/post/editpost", {
        title: "Edit your post",
        error: errors.mapped(),
        flashMessage: Flash.getMessage(req),
        post,
      });
    }

    if (tags) {
      tags = tags.split(",");
      tags = tags.map((tag) => tag.trim());
    }

    let thumbnail = post.thumbnail;

    if (req.file) {
      thumbnail = `/uploads/${req.file.filename}`;
    }

    let editPost = await Post.findOneAndUpdate(
      { _id: post._id },
      {
        $set: {
          title,
          body,
          tags,
          thumbnail,
        },
      },
      { new: true }
    );

    req.flash("success", "Post Updated Successfully");
    res.render("pages/dashboard/post/editpost", {
      title: "Edit your post",
      error: errors.mapped(),
      flashMessage: Flash.getMessage(req),
      post: editPost,
    });
  } catch (e) {
    next(e);
  }
};

exports.deletePostController = async (req, res, next) => {
  let {postId} = req.params;
  
  try {
    let post = await Post.findOne({ author: req.user._id, _id: postId });
    
    if (!post) {
      let error = new Error("404 not found");
      error.status = 404;
      throw error;
    }

    await Post.findOneAndDelete({_id: postId});
    await Profile.findOneAndUpdate(
      { user: req.user._id },
      { $pull: { posts: postId } }
    );

    req.flash('success', 'Post Deleted Successfully')
    res.redirect('/posts/create')
  } catch (e) {
    next(e);
  }
};


exports.postGetController = async (req, res, next) => {
  try {
    let posts = await Post.find({author: req.user._id})

    res.render('pages/dashboard/post/posts', {
      title: 'List Of My Post',
      flashMessage: Flash.getMessage(req),
      posts
    })
    
  } catch (e) {
    next(e)
  }
}