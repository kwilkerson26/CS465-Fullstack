const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user"); 

passport.use(
  new LocalStrategy(
    {
      usernameField: "email", // use email instead of username
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        // Find user by email
        const user = await User.findOne({ email: email }).exec();
        if (!user) {
          return done(null, false, { message: "Incorrect email." });
        }

        // Validate password
        if (!user.validPassword(password)) {
          return done(null, false, { message: "Incorrect password." });
        }

        // Success
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);
