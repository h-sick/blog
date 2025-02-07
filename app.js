require('dotenv').config();

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const errorController = require('./controllers/error');
const sequelize = require('./database');

const mainRoutes = require('./routes/main');
const blogRoutes = require('./routes/blog');
const authRoutes = require('./routes/auth');

const Blog = require('./models/blog');
const User = require('./models/user');

// Session store initialization
const sessionStore = new SequelizeStore({
  db: sequelize,
});

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Session setting
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1day
    },
  })
);

app.use(mainRoutes.userMiddleware);
app.use(mainRoutes);
app.use('/blog', blogRoutes);
app.use(authRoutes);
app.use(errorController.get404);

Blog.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Blog);

const port = 3000;

sessionStore
  .sync()
  .then(() => {
    return sequelize.sync();
  })
  .then((result) => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({
        name: 'admin',
        email: 'hyosikkim1022@gmail.com',
        password: bcrypt.hashSync('q1w2e3r4!!', 12),
      });
    }
    return user;
  })
  .then((user) => {
    app.listen(port);
  })
  .catch((err) => {
    console.log(err);
  });
