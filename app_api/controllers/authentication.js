const User = require('../models/user');
const passport = require('passport');

const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Create new user
    const user = new User({ name, email });
    user.setPassword(password);
    await user.save();

    // Generate JWT using User model method
    const token = user.generateJWT();

    return res.status(201).json({
      token,
      user: { name: user.name, email: user.email }
    });

  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

const login = (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ message: "All fields required" });
  }

  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: "Authentication error", error: err });
    }
    if (!user) {
      return res.status(401).json(info); // incorrect email/password
    }

    // Auth succeeded
    const token = user.generateJWT();
    return res.status(200).json({ token, user: { name: user.name, email: user.email } });
  })(req, res);
};

module.exports = {
  register,
  login
};