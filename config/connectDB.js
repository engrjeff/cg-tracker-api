const mongoose = require("mongoose");

const DB_URI = process.env.DB_URI;

const connectDB = () => {
  if (!DB_URI) {
    console.error('Invalid DB connection string.'.red.bold);
    process.exit(1);
  }
  mongoose
    .connect(DB_URI)
    .then((conn) => {
      console.log('Connected to DB'.green.bold);
      console.log(`Database: ${conn.connection.db.databaseName}`.green.bold);
    })
    .catch((err) => console.error(err));
};

module.exports = connectDB;
