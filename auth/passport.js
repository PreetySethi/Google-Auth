const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'https://google-auth-qckh.onrender.com/auth/google/callback'
  //callbackURL: 'http://localhost:3000/auth/google/callback'  // for local testing
}, (accessToken, refreshToken, profile, done) => {
  console.log("Access Token:", accessToken);
  console.log("Google Profile:", profile);
  //save the profile in the session or database here
  return done(null, profile); // 'done' is a callback method to finish the process
}));

passport.serializeUser((user, done) => {
  done(null, user); // Save the entire user profile in the session
});

passport.deserializeUser((user, done) => {
  done(null, user); // Retrieve the user profile from the session
});
