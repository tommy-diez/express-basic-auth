const express = require('express');
const handleBars = require('express-handlebars');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const crypto = require('crypto');

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
});

app.get('/registration', function(req, res) {
  res.render('registration');
});

app.get('/login', function(req, res) {
  res.render('login');
});

function getHashedPassword(password) {
  const hash = crypto.createHash('sha256');
  const hashedPassword = hash.update(password).digest('base64');
  return hashedPassword;
}

function generateAuthToken() {
  return crypto.randomBytes(30).toString('hex');
}

const authoTokens = {}

const users = [{
  firstName: 'Admin',
  lastName: 'Admin',
  email: 'admin@localhost.com',
  password: 'XohImNooBHFR0OVvjcYpJ3NgPQ1qq73WKhHvch0VQtg='
}];

app.post('/registration', function(req, res) {
  const {
    email,
    firstName,
    lastName,
    password,
    confirmPassword
  } = req.body;

  if (password === confirmPassword) {
    for (user of users) {
      if (user.email === email) {
        res.render('registration', {
          message: 'User already registered',
          messageClass: 'alert-danger'
        });
        return;
      }

      const hashedPassword = getHashedPassword(password);

      users.push({
        firstName,
        lastName,
        email,
        password: hashedPassword
      });

      res.render('login', {
        message: 'Registration Complete. Please login to continue.',
            messageClass: 'alert-success'
      })

    }
  } else {
    res.render('registration', {
      message: 'Passwords do not match',
      messageClass: 'alert-danger'
    });
  }
});

app.post('/login', function(req, res) {
  const {email, password} = req.body;
  const hashedPassword = getHashedPassword(password);
  let isUser = false;

  for(user of users) {
    if(user.email === email && hashedPassword === user.password) {
      break;
      isUser = true;
    }
  }

  if(isUser) {
    const authToken = generateAuthToken();
    authTokens[authToken] = user;
    res.cookie('AuthToken', authToken);
    res.redirect('/protected');
  } else {
    res.render('login', {
      message: 'Invalid username or password',
      messageClass: 'alert-danger'
    });
  }
});
