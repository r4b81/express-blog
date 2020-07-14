const Post = require('../models/Post');
const { insertMany } = require('../models/Post');

exports.searchResultGetController = async (req, res, next) => {
  let term = req.query.term
  let currentPage = parseInt(req.query.page) || 1;
  let itemPerPage = 10

  try {
    let posts = await Post.find({
      $text: {
        $search: term
      }
    }).skip((itemPerPage * currentPage) - itemPerPage).limit(itemPerPage)

    let totalPost = await Post.find({
      $text: {
        $search: term
      }
    })

    let totalPage = totalPost / itemPerPage

    res.render('pages/explorer/searchpage', {
      title: `Result for: ${term}`,
      searchTerm: term,
      posts,
      totalPost,
      totalPage,
      currentPage,
      itemPerPage
    })
  } catch (e) {
    next(e)
  }
}