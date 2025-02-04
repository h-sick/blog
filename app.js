const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const errorController = require('./controllers/error');
const sequelize = require('./database');

const mainRoutes = require('./routes/main');
const blogRoutes = require('./routes/blog');

const Blog = require('./models/blog');
const User = require('./models/user');

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(mainRoutes.userMiddleware);
app.use(mainRoutes);
app.use('/blog', blogRoutes);
app.use(errorController.get404);

Blog.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Blog);

const port = 3000;

sequelize
  // .sync({ force: true })
  .sync()
  .then((result) => {
    return User.findById(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({
        name: 'admin',
        email: 'hyosikkim1022@gmail.com',
        password: 'q1w2e3r4!!',
      });
    }
    return user;
  })
  .then((user) => {
    console.log('User created =>\n', user);
    app.listen(port);
  })
  .catch((err) => {
    console.log(err);
  });
