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
  getEditBlog: (req, res, next) => {
    const blogId = req.params.id;
    Blog.findByPk(blogId)
      .then((blog) => {
        if (!blog) {
          return res.redirect('/');
        }
        // Only the author of the blog can edit
        if (blog.userId !== req.user.id) {
          return res.redirect('/');
        }
        res.render('blog/blog-edit', {
          title: 'Edit Blog',
          blog: blog,
        });
      })
      .catch((err) => {
        console.log(err);
        res.redirect('/');
      });
  },
  postEditBlog: (req, res, next) => {
    const blogId = req.params.id;
    const updatedTitle = req.body.title;
    const updatedAuthor = req.body.author;
    const updatedContent = req.body.content;
    const updatedTags = req.body.tags;

    Blog.findByPk(blogId)
      .then((blog) => {
        if (!blog) {
          return res.redirect('/');
        }
        // Only the author of the blog can edit
        if (blog.userId !== req.user.id) {
          return res.redirect('/');
        }
        blog.title = updatedTitle;
        blog.author = updatedAuthor;
        blog.content = updatedContent;
        blog.tags = updatedTags;
        return blog.save();
      })
      .then(() => {
        res.redirect('/blog/' + blogId);
      })
      .catch((err) => {
        console.log(err);
        res.redirect('/');
      });
  },
  deleteBlog: (req, res, next) => {
    const blogId = req.params.id;
    Blog.findByPk(blogId)
      .then((blog) => {
        if (!blog) {
          return res.status(404).json({ message: "Can't find the blog." });
        }
        // Only the author of the blog can delete
        if (blog.userId !== req.user.id) {
          return res.status(403).json({ message: 'Forbidden' });
        }
        return blog.destroy();
      })
      .then(() => {
        res.status(200).json({ message: 'Blog deleted successfully.' });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ message: 'Server error occurred.' });
      });
  },
};
