require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
require('./auth');

const app = express();

app.set('view engine', 'ejs');

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.render('home', { user: req.user });
});

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => res.redirect('/')
);

app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

//app.listen(3000, () => console.log('Server running on http://localhost:3000')); - for local

const PORT = process.env.PORT || 3000; //  for Render
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

