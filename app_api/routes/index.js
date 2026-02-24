const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { param } = require('express-validator'); // NEW

// Controllers
const tripsController = require('../controllers/trips');
const authController = require('../controllers/authentication');

// JWT Middleware
function authenticateJWT(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header required' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(400).json({ message: 'Malformed Authorization header' });
  }

  const token = parts[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.auth = decoded;
    next();
  });
}

// Auth routes
router.route('/register').post(authController.register);
router.route('/login').post(authController.login);

// Trips routes
router
  .route('/trips')
  .get(tripsController.tripsList)
  .post(authenticateJWT, tripsController.tripsAddTrip);

router
  .route('/trips/:tripCode')
  .get(
    [
      param('tripCode')
        .isAlphanumeric()
        .withMessage('Trip code must be alphanumeric')
    ],
    tripsController.tripsFindByCode
  )
  .put(
    authenticateJWT,
    [
      param('tripCode')
        .isAlphanumeric()
        .withMessage('Trip code must be alphanumeric')
    ],
    tripsController.tripsUpdateTrip
  );

module.exports = router;