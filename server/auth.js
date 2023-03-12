const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('./models/user');

passport.use(
    new LocalStrategy((username, password, done) => {
        User.findOne({ username: username })
          .then(result => {
            if(result == null) {
                return done(null, false, { message: "Invalid username" });
            }

            bcrypt.compare(password, result.password, (err, match) => {
                if(match) {
                    console.log("Logged in");
                    return done(null, result, { message: "Success" });
                } else {
                    return done(null, false, { message: "Invalid password" });
                }
            })
          }).catch(err => {
            return done(err);
          });
    })
);

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id)
      .then((err, user) => {
        console.log(user);
        done(err, user)
    })
});

module.exports = passport;