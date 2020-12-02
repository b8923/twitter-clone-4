const User = require("./model/userSchema");
const bcrypt = require("bcrypt");
const localStrategy = require("passport-local").Strategy;

// function that creates the new local stradegy,
// authenticating the user
module.exports = function (passport) {
  passport.use(
    new localStrategy((username, password, done) => {
      User.findOne({ phone: username }, (err, user) => {
        if (err) throw err;
        if (!user) return done(null, false);
        bcrypt.compare(password, user.password, (err, result) => {
          if (err) throw err;
          if (result === true) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        });
      });
    })
  );

  passport.serializeUser((user, cb) => {
    cb(null, user.id);
  });
  passport.deserializeUser((id, cb) => {
    User.findOne({ _id: id }, (err, user) => {
      const userInformation = {
        username: user,
      };
      cb(err, userInformation);
    });
  });
};


