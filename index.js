// require('dotenv').config();
// const express = require('express');
// const session = require('express-session');
// const passport = require('passport');
// require('./auth/passport');  // Import the passport configuration

// const app = express();

// app.set('view engine', 'ejs'); // Set the view engine to EJS

// // Session middleware (stores user session in memory)
// app.use(session({
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: true
// }));

// // Passport middleware
// app.use(passport.initialize());
// app.use(passport.session());

// // Route to render the homepage and show user info
// app.get('/', (req, res) => {
//   console.log('User session:', req.user);  // Log user data to verify session
//   res.render('home', { user: req.user });  // Render home.ejs with user data
// });

// // Google OAuth login route
// app.get('/auth/google',
//   passport.authenticate('google', { scope: ['profile', 'email'] })
// );

// // Google callback route with better error handling
// app.get('/auth/google/callback',
//     (req, res, next) => {
//       passport.authenticate('google', (err, user, info) => {
//         console.log('OAuth Callback Info:', info);  // Log OAuth info
//         if (err) {
//           console.error('Google Auth Error:', err);  // Log error object
//           return res.status(500).send('Authentication error: ' + err.message);
//         }
//         if (!user) {
//           console.log('No user found', info);  // Log failure info
//           return res.redirect('/');
//         }
//         console.log('User logged in:', user);  // Log user profile
  
//         req.logIn(user, (err) => {
//           if (err) {
//             console.error('Error logging in user:', err);
//             return next(err);
//           }
//           return res.redirect('/');  // Redirect to homepage after login
//         });
//       })(req, res, next);
//     }
//   );
  

// // Logout route to end the session
// app.get('/logout', (req, res) => {
//   req.logout(() => {
//     res.redirect('/');  // Redirect to homepage after logging out
//   });
// });

// // Start the server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

// console.log('Google Client ID:', process.env.GOOGLE_CLIENT_ID);
// console.log('Google Client Secret:', process.env.GOOGLE_CLIENT_SECRET);


require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
require('./auth/passport'); // Google strategy

const app = express();

// Middleware
app.set('view engine', 'ejs');
app.use(express.static('public')); // for CSS if needed
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// 🔐 Middleware to protect routes
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
}

// Routes
app.get('/', (req, res) => {
  res.redirect(req.isAuthenticated() ? '/dashboard' : '/login');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.render('dashboard', { user: req.user });
});

app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/login');
  });
});

// Google Auth
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => res.redirect('/dashboard')
);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));