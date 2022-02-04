const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');
const User = require('../models/User');
const Disciple = require('../models/Disciple');

exports.getDisciples = asyncHandler(async (req, res) => {
  const disciples = await Disciple.find({ isDeleted: false }).populate({
    path: 'leaderId',
    select: 'name',
  });
  res
    .status(200)
    .json({ success: true, count: disciples.length, data: disciples });
});

exports.getDisciple = asyncHandler(async (req, res, next) => {
  const disciple = await Disciple.findById(req.params.id).populate({
    path: 'leaderId',
    select: 'name',
  });

  if (!disciple) return next(new ErrorResponse(404, 'Disciple not found.'));
  res.status(200).json({ success: true, data: disciple });
});

exports.createDisciple = asyncHandler(async (req, res, next) => {
  if (!req.user) return next(new ErrorResponse(404, 'Cannot find leader.'));

  const leader = await User.findById(req.user.id);

  if (!leader) return next(new ErrorResponse(404, 'Cannot find leader.'));

  const data = { ...req.body, leaderId: leader.id };
  const disciple = await Disciple.create(data);

  res.status(201).json({ success: true, data: disciple });
});

exports.updateDisciple = asyncHandler(async (req, res) => {
  const disciple = await Disciple.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: disciple });
});

exports.deleteDisciple = asyncHandler(async (req, res) => {
  await Disciple.findByIdAndUpdate(req.params.id, { isDeleted: true });

  res.status(204).json({ success: true, data: {} });
});

exports.removeDisciple = asyncHandler(async (req, res) => {
  await Disciple.findByIdAndRemove(req.params.id);

  res.status(204).json({ success: true, data: {} });
});
