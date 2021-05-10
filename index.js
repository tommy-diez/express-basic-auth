const express = require('express');
const handleBars = require('express-handlebars');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(cookieParser());

app.engine('hbs', handleBars({
      extname: '.hbs'
    }));

app.set('view engine', 'hbs');

app.listen(3000);

app.get('/', function(req, res) {
  res.render('home');
})
