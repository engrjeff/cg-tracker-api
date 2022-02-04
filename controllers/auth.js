const User = require('../models/User');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../utils/asyncHandler');

exports.register = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    role,
  });

  sendTokenResponse(user, 201, res);
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new ErrorResponse(400, 'Provide an email and a password.'));

  const user = await User.findOne({ email }).select('+password');

  if (!user) return next(new ErrorResponse(401, 'Invalid credentials.'));

  const passwordsMatched = await user.comparePassword(password);

  if (!passwordsMatched)
    return next(new ErrorResponse(401, 'Invalid credentials.'));

  sendTokenResponse(user, 200, res);
});

exports.forgotPassword = async (req, res, next) => {
  try {
    res.send('forgotPassword');
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    res.send('resetPassword');
  } catch (err) {
    next(err);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    res.send('changePassword');
  } catch (err) {
    next(err);
  }
};

const sendTokenResponse = (user, statusCode, res) => {
  const token = user.generateToken();
  const refreshToken = user.generateRefreshToken();

  res.status(statusCode).json({ success: true, token, refreshToken });
};
