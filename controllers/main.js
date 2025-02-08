const Blog = require('../models/blog');

module.exports = {
  getIndex: (req, res, next) => {
    Blog.findAll()
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
