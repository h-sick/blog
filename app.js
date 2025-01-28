const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const mainRoutes = require('./routes/main');

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(mainRoutes);

const port = 3000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
