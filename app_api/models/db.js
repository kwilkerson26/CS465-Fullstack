const mongoose = require('mongoose');
const readline = require('readline');
require('dotenv').config();

const host = process.env.DB_HOST || '127.0.0.1';
const dbName = 'travlr';
const dbURI = `mongodb://${host}:27017/${dbName}`;

// Connect to MongoDB
const connect = async () => {
  try {
    await mongoose.connect(dbURI); // no options needed in Mongoose 7+
    console.log(`Mongoose connected to ${dbURI}`);
  } catch (err) {
    console.error('Mongoose connection error:', err);
  }
};

// Connection events
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

// Windows specific listener
if (process.platform === 'win32') {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.on('SIGINT', () => {
    process.emit('SIGINT');
  });
}

// Graceful shutdown
const gracefulShutdown = (msg) => {
  mongoose.connection.close(() => {
    console.log(`Mongoose disconnected through ${msg}`);
  });
};

process.once('SIGUSR2', () => {
  gracefulShutdown('nodemon restart');
  process.kill(process.pid, 'SIGUSR2');
});

process.on('SIGINT', () => {
  gracefulShutdown('app termination');
  process.exit(0);
});

process.on('SIGTERM', () => {
  gracefulShutdown('app shutdown');
  process.exit(0);
});

// Start connection immediately
connect();

// Load schemas
require('./travlr');

module.exports = mongoose;