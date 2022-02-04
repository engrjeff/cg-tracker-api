const { JsonWebTokenError } = require('jsonwebtoken');
const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/ErrorResponse');

exports.authenticateLoginToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer')) {
      return next(new ErrorResponse(401, 'Unauthorized application.'));
    }

    const token = authHeader.split(' ')[1];

    await jwt.verify(token, 'cg-tracker');

    next();
  } catch (err) {
    if (err instanceof JsonWebTokenError)
      return next(new ErrorResponse(401, 'Unauthorized application.'));
    next(err);
  }
};

exports.protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer')) {
      return next(new ErrorResponse(401, 'Unauthorized.'));
    }

    const token = authHeader.split(' ')[1];

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (err) {
    if (err instanceof JsonWebTokenError)
      return next(new ErrorResponse(401, 'Unauthorized.'));
    next(err);
  }
};
