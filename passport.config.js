var crypto = require('crypto');
var LocalStrategy = require('passport-local').Strategy;
var Database = require('./db');
var conn = new Database();

// Passport Configure
module.exports = (passport) => {
  passport.serializeUser((user, done) => { //session configuration
    done(null, user._id);
  });

  passport.deserializeUser((id, done) => {
    conn.findUserById({
      id: id
    }, (user) => {
      done(null, user);
    });
  });
  passport.use(new LocalStrategy({ // for local authentication
      usernameField: 'email',
      passwordField: 'password'
    },
    (email, password, done) =>  {
      const encrypt = crypto.createHash('sha256').update(password+email).digest('hex');
      conn.verifyUser({
        email:email,
        password:encrypt
      }, (user) => {
        if(!user) {
          return done(null, false, { message: 'Incorrect email.' }, 1);
        }
        if (user.password !== encrypt) {
          return done(null, false, { message: 'Incorrect password.' }, 2);
        }
        return done(null, user);
      })
    })
  )
};
