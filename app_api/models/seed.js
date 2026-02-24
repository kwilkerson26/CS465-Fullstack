// Import the database connection
const mongoose = require('./db');

// Import the mongoose model for trips
const Trip = require('./travlr');

// Import the file system module (promises API)
const fs = require('fs').promises;

const seedDB = async () => {
  try {
    // Read trips JSON file asynchronously
    const fileData = await fs.readFile('./data/trips.json', 'utf8');
    const trips = JSON.parse(fileData);

    console.log('Trips to insert:', trips.length);

    // Delete all existing trips
    console.log('Deleting existing trips...');
    const del = await Trip.deleteMany({});
    console.log('Deleted:', del.deletedCount);

    // Insert new trips
    console.log('Inserting trips...');
    const inserted = await Trip.insertMany(trips);
    console.log('Inserted:', inserted.length);

    // Close database connection
    await mongoose.connection.close();
    console.log('Database connection closed.');

    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);

    // Ensure DB connection closes on error
    await mongoose.connection.close();
    process.exit(1);
  }
};

// Run the seed function
seedDB();