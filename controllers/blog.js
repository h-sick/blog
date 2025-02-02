const Blog = require('../models/blog');

module.exports = {
  getNewBlog: (req, res, next) => {
    res.render('blog-new', {
      title: 'New Blog',
    });
  },
  postNewBlog: (req, res, next) => {
    const title = req.body.title;
    const author = req.body.author;
    const content = req.body.content;
    // const tags = req.body.tags;

    Blog.create({
      title,
      author,
      content,
      // tags,
    }).then((result) => {
      res.redirect('/');
    });
  },
};
