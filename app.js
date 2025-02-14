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

const authMiddleware = require('./middleware/auth');

const Blog = require('./models/blog');
const User = require('./models/user');

// Session store initialization
const sessionStore = new SequelizeStore({
  db: sequelize,
  // expiration: 0, // Set to 0 to disable session expiration
  checkExpirationInterval: 15 * 60 * 1000, // 15 minutes
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
      // maxAge: 0, // Set to 0 to disable session expiration
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      httpOnly: true,
      // secure: process.env.NODE_ENV === 'production',
      sameSite: true, // CSRF protection
    },
  })
);

app.use(authMiddleware.setUser);
app.use(authMiddleware.setLocals);
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
    // return sequelize.sync({ force: true });
  })
  .then((user) => {
    app.listen(port);
  })
  .catch((err) => {
    console.log(err);
  });
