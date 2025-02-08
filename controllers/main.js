const Blog = require('../models/blog');

module.exports = {
  getIndex: (req, res, next) => {
    if (!req.user) {
      return res.render('main', {
        title: 'Blogs',
        blogs: [],
      });
    }

    req.user
      .getBlogs()
      .then((blogs) => {
        res.render('main', {
          title: 'Blogs',
          blogs,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
