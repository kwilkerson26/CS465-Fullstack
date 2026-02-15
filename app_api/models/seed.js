// Import the database connection
const mongoose = require('./db');

// Import the mongoose model for trips
const Trip = require('./travlr');

// Import the file system module to read JSON data
const fs = require('fs');

// Read and parse the trips data from the JSON file
const trips = JSON.parse(
  fs.readFileSync('./data/trips.json', 'utf8')
);

// Log the number of trips in the JSON file
console.log('Trips to insert:', trips.length);

// Seed function to populate the database
const seedDB = async () => {
    // Delete all existing trips in the collection
  console.log('Deleting existing trips...');
  const del = await Trip.deleteMany({});
  // Log how many documents were deleted
  console.log('Deleted:', del.deletedCount);

    // Insert the new trips from the JSON file
  console.log('Inserting trips...');
  const inserted = await Trip.insertMany(trips);
  // Log how many trips were added
  console.log('Inserted:', inserted.length);
};

// Run the seed function, then close the database connection
seedDB().then(async () => {
  await mongoose.connection.close();
  process.exit(0);
});
