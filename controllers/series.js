const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');
const User = require('../models/User');
const Series = require('../models/Series');

/**
 * @route /series
 * @method GET
 * @description Gets all the series in the database.
 */
exports.getAll = asyncHandler(async (req, res) => {
  res.status(200).json(res.advancedResults);
});

/**
 * @route /series/:id
 * @method GET
 * @description Gets a series by its ID.
 */
exports.get = asyncHandler(async (req, res, next) => {
  const series = await Series.findById(req.params.id).populate('lessons');

  if (!series) return next(new ErrorResponse(404, 'Series not found.'));
  res.status(200).json({ success: true, data: series });
});

/**
 * @route /series
 * @method POST
 * @description Creates a series.
 */
exports.create = asyncHandler(async (req, res, next) => {
  if (!req.user) return next(new ErrorResponse(404, 'Cannot find user.'));

  const user = await User.findById(req.user.id);

  if (!user) return next(new ErrorResponse(404, 'Cannot find user.'));

  const existingSeries = await Series.findOne({
    title: req.body.title,
    user: user.id,
  });

  if (existingSeries && !existingSeries.isDeleted)
    return next(
      new ErrorResponse(404, 'The provided series title is already in use.')
    );

  const data = { ...req.body, user: user.id };
  const series = await Series.create(data);

  res.status(201).json({ success: true, data: series });
});

/**
 * @route /series/:id
 * @method PUT
 * @description Updates an existing series.
 */
exports.update = asyncHandler(async (req, res, next) => {
  let series = await Series.findById(req.params.id);

  if (!series) return next(new ErrorResponse(404, 'Series not found.'));

  const existingSeries = await Series.findOne({
    title: req.body.title,
    user: req.user.id,
  });

  if (
    existingSeries &&
    !existingSeries.isDeleted &&
    series.title !== req.body.title
  )
    return next(
      new ErrorResponse(404, 'The provided series title is already in use.')
    );

  series = await Series.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: series });
});

/**
 * @route /series/:id
 * @method DELETE
 * @description This is just a `soft delete`. Updates a series' `isDeleted` property to `true`.
 */
exports.delete = asyncHandler(async (req, res, next) => {
  const series = await Series.findByIdAndUpdate(req.params.id, {
    isDeleted: true,
  });

  if (!series) return next(new ErrorResponse(404, 'Series not found.'));

  res.status(200).json({ success: true, data: {} });
});
