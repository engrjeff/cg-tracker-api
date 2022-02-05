const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');
const User = require('../models/User');
const Disciple = require('../models/Disciple');

/**
 * @route /disciples
 * @method GET
 * @description Gets the disciples in the database.
 */
exports.getAll = asyncHandler(async (req, res) => {
  res.status(200).json(res.advancedResults);
});

/**
 * @route /disciples/:id
 * @method GET
 * @description Gets a disciple by its ID.
 */
exports.get = asyncHandler(async (req, res, next) => {
  const disciple = await Disciple.findById(req.params.id).populate({
    path: 'leader',
    select: 'name',
  });

  if (!disciple) return next(new ErrorResponse(404, 'Disciple not found.'));
  res.status(200).json({ success: true, data: disciple });
});

/**
 * @route /disciples/me
 * @method GET
 * @description Gets the disciples of the logged in user.
 */
exports.getForUser = asyncHandler(async (req, res) => {
  const disciples = await Disciple.find({
    leader: req.user.id,
    isDeleted: false,
  });

  res
    .status(200)
    .json({ success: true, count: disciples.length, data: disciples });
});

/**
 * @route /disciples
 * @method POST
 * @description Creates a disciple.
 */
exports.create = asyncHandler(async (req, res, next) => {
  if (!req.user) return next(new ErrorResponse(404, 'Cannot find leader.'));

  const leader = await User.findById(req.user.id);

  if (!leader) return next(new ErrorResponse(404, 'Cannot find leader.'));

  const data = { ...req.body, leader: leader.id };
  const disciple = await Disciple.create(data);

  res.status(201).json({ success: true, data: disciple });
});

/**
 * @route /disciples/:id
 * @method PUT
 * @description Updates an existing disciple.
 */
exports.update = asyncHandler(async (req, res, next) => {
  const disciple = await Disciple.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!disciple) return next(new ErrorResponse(404, 'Disciple not found.'));

  res.status(200).json({ success: true, data: disciple });
});

/**
 * @route /disciples/:id
 * @method DELETE
 * @description This is just a `soft delete`. Updates a disciple's `isDeleted` property to `true`.
 */
exports.delete = asyncHandler(async (req, res, next) => {
  const disciple = await Disciple.findByIdAndUpdate(req.params.id, {
    isDeleted: true,
  });

  if (!disciple) return next(new ErrorResponse(404, 'Disciple not found.'));

  res.status(200).json({ success: true, data: {} });
});

/**
 * @route /disciples/:id/remove
 * @method DELETE
 * @description Deletes a disciple from the database.
 */
exports.remove = asyncHandler(async (req, res, next) => {
  const disciple = await Disciple.findByIdAndRemove(req.params.id);
  if (!disciple) return next(new ErrorResponse(404, 'Disciple not found.'));
  res.status(200).json({ success: true, data: {} });
});
