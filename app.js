const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const errorController = require('./controllers/error');
const sequelize = require('./database');

const mainRoutes = require('./routes/main');
const blogRoutes = require('./routes/blog');

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(mainRoutes);
app.use('/blog', blogRoutes);
app.use(errorController.get404);

const port = 3000;

sequelize
  .sync({ force: true }) // 테이블을 강제로 다시 생성
  .then(() => {
    app.listen(port);
  })
  .catch((err) => {
    console.log(err);
  });
