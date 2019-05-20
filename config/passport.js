const LocalStrategy = require('passport-local').Strategy;

// Load User model
const User = {
  email: 'admin',
  password: '123456'
};

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match user
      if (User.email != email)
        return done(null, false, { message: 'That email is not registered' });

      // Match password

      if (User.password == password) return done(null, User);
      else return done(null, false, { message: 'Password incorrect' });
    })
  );

  passport.serializeUser(function(user, done) {
    done(null, User);
  });

  passport.deserializeUser(function(id, done) {
      done(null, User);
  });
};
