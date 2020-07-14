const {body} = require('express-validator')
const cheerio = require('cheerio')

module.exports = [
  body('title')
    .not().isEmpty().withMessage('title can not be empty')
    .isLength({max: 100}).withMessage('title can not be greater than 100 chars')
    .trim()
  ,
  body('body').not().isEmpty().withMessage('Post Body can not be empty')
    .custom(value => {
      let node = cheerio.load(value)
      let text = node.text()

      if (text.lenght > 5000) {
        throw new Error('Body can not be greater than 5000 chars')
      }
      return true
    })
  ,
  body('tags').not().isEmpty().withMessage('tags can not be empty')
]

