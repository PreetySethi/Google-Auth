require('dotenv').config(); // Load environment variables
const express = require('express');
const session = require('express-session');
const passport = require('passport');
require('./auth/passport'); // Import Google OAuth strategy

const app = express();
app.set('view engine', 'ejs'); // EJS template engine

// Serve static files (like CSS)
app.use(express.static('public'));

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Homepage route (login/signup screen)
app.get('/', (req, res) => {
  res.render('login', { user: req.user });
});

// Google OAuth login route
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google callback route
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/dashboard'); // After successful login, redirect to dashboard
  }
);

// Logout route
app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

// Dashboard route (after login)
app.get('/dashboard', (req, res) => {
  if (!req.user) {
    return res.redirect('/');
  }
  res.render('dashboard', { user: req.user }); // Render dashboard with user info
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
