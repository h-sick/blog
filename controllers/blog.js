const Blog = require('../models/blog');

module.exports = {
  getNewBlog: (req, res, next) => {
    if (!req.user) {
      return res.redirect('/');
    }

    res.render('blog/blog-new', {
      title: 'New Blog',
    });
  },
  postNewBlog: (req, res, next) => {
    const title = req.body.title;
    const author = req.body.author;
    const content = req.body.content;
    const tags = req.body.tags;

    req.user
      .createBlog({
        title,
        author,
        content,
        tags,
      })
      .then((result) => {
        res.redirect('/');
      });
  },
  getUserBlogs: (req, res, next) => {
    Blog.findAll({ where: { userId: req.params.id } })
      .then((blogs) => {
        res.render('blog/user-blogs', {
          title: 'My Blogs',
          blogs,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  },
  getBlogDetail: (req, res, next) => {
    const blogId = req.params.id;
    Blog.findByPk(blogId)
      .then((blog) => {
        if (!blog) {
          return res.redirect('/');
        }
        res.render('blog/blog-detail', {
          title: blog.title,
          blog: blog,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
