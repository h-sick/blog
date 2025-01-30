module.exports = {
  getNewBlog: (req, res, next) => {
    res.render('blog-new', {
      title: 'New Blog',
    });
  },
};
