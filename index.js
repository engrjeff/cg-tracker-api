require('dotenv').config();
require('colors');

const PORT = process.env.PORT || 5000;

const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');

const connectDB = require('./config/connectDB');
const errorHandler = require('./middlewares/errorHandler');

connectDB();

const app = express();

app.use(express.json());

app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.get('/api/v1/health-check', (req, res) => res.send('CG Tracker API...'));

app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/users', require('./routes/user'));
app.use('/api/v1/disciples', require('./routes/disciples'));
app.use('/api/v1/series', require('./routes/series'));
app.use('/api/v1/lessons', require('./routes/lesson'));

// error handler
app.use(errorHandler);

const server = app.listen(PORT, () =>
  console.log(`Server running at port: ${PORT}.`.yellow.underline)
);

// handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.log(err.message);
  server.close(() => process.exit(1));
});
