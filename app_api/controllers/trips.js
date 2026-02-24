const mongoose = require('mongoose');
const Trip = require('../models/travlr');
const { validationResult } = require('express-validator');

const Model = mongoose.model('trips');


// GET: /trips
const tripsList = async (req, res) => {
  try {
    const trips = await Model.find({}).exec();

    if (!trips || trips.length === 0) {
      return res.status(404).json({
        message: 'No trips found'
      });
    }

    return res.status(200).json(trips);

  } catch (err) {
    return res.status(500).json({
      message: 'Server error retrieving trips',
      error: err.message
    });
  }
};


// GET: /trips/:tripCode
const tripsFindByCode = async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }

  try {
    const trip = await Model.findOne({ code: req.params.tripCode }).exec();

    if (!trip) {
      return res.status(404).json({
        message: 'Trip not found'
      });
    }

    return res.status(200).json(trip);

  } catch (err) {
    return res.status(500).json({
      message: 'Server error retrieving trip',
      error: err.message
    });
  }
};


// POST: /trips
const tripsAddTrip = async (req, res) => {
  try {
    const newTrip = new Trip({
      code: req.body.code,
      name: req.body.name,
      length: req.body.length,
      start: req.body.start,
      resort: req.body.resort,
      perPerson: req.body.perPerson,
      image: req.body.image,
      description: req.body.description
    });

    const savedTrip = await newTrip.save();

    return res.status(201).json(savedTrip);

  } catch (err) {
    return res.status(400).json({
      message: 'Error creating trip',
      error: err.message
    });
  }
};


// PUT: /trips/:tripCode
const tripsUpdateTrip = async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }

  try {
    const updatedTrip = await Model.findOneAndUpdate(
      { code: req.params.tripCode },
      {
        code: req.body.code,
        name: req.body.name,
        length: req.body.length,
        start: req.body.start,
        resort: req.body.resort,
        perPerson: req.body.perPerson,
        image: req.body.image,
        description: req.body.description
      },
      { new: true }
    ).exec();

    if (!updatedTrip) {
      return res.status(404).json({
        message: 'Trip not found'
      });
    }

    return res.status(200).json(updatedTrip);

  } catch (err) {
    return res.status(500).json({
      message: 'Error updating trip',
      error: err.message
    });
  }
};


module.exports = {
  tripsList,
  tripsFindByCode,
  tripsAddTrip,
  tripsUpdateTrip
};
