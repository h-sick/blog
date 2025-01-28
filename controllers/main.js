module.exports = {
  getIndex: (req, res, next) => {
    res.render('main', {
      title: 'blog',
    });
  },
};
