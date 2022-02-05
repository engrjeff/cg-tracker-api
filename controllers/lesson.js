const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');
const User = require('../models/User');
const Lesson = require('../models/Lesson');
const Series = require('../models/Series');

/**
 * @route /lessons
 * @method GET
 * @description Gets all the lessons in the database.
 */
exports.getAll = asyncHandler(async (req, res) => {
  res.status(200).json(res.advancedResults);
});

/**
 * @route /lessons/:id
 * @method GET
 * @description Gets a lesson by its ID.
 */
exports.get = asyncHandler(async (req, res, next) => {
  const lesson = await Lesson.findById(req.params.id).populate({
    path: 'series',
    select: 'title',
  });

  if (!lesson) return next(new ErrorResponse(404, 'Lesson not found.'));
  res.status(200).json({ success: true, data: lesson });
});

/**
 * @route /lessons
 * @method POST
 * @description Creates a lesson.
 */
exports.create = asyncHandler(async (req, res, next) => {
  if (!req.user) return next(new ErrorResponse(404, 'Cannot find user.'));

  const user = await User.findById(req.user.id);

  if (!user) return next(new ErrorResponse(404, 'Cannot find user.'));

  // get the series using req.query.seriesId
  const series = await Series.findById(req.body.series);

  if (!series) return next(new ErrorResponse(404, 'Series not found.'));

  const existingLesson = await Lesson.findOne({
    title: req.body.title,
    user: user.id,
    series: series.id,
  });

  if (existingLesson && !existingLesson.isDeleted)
    return next(
      new ErrorResponse(404, 'The provided lesson title is already in use.')
    );

  const values = { ...req.body, user: user.id };
  const lesson = await Lesson.create(values);

  res.status(201).json({ success: true, data: lesson });
});

/**
 * @route /lessons/:id
 * @method PUT
 * @description Updates an existing lesson.
 */
exports.update = asyncHandler(async (req, res, next) => {
  let lesson = await Lesson.findById(req.params.id);

  if (!lesson) return next(new ErrorResponse(404, 'Lesson not found.'));

  const existingLesson = await Lesson.findOne({
    title: req.body.title,
    user: req.user.id,
    series: lesson.series,
  });

  if (
    existingLesson &&
    !existingLesson.isDeleted &&
    lesson.title !== req.body.title
  )
    return next(
      new ErrorResponse(
        404,
        'The provided lesson title is already in use in this series.'
      )
    );

  lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: lesson });
});

/**
 * @route /lessons/:id
 * @method DELETE
 * @description This is just a `soft delete`. Updates a lesson's' `isDeleted` property to `true`.
 */
exports.delete = asyncHandler(async (req, res, next) => {
  const lesson = await Lesson.findByIdAndUpdate(req.params.id, {
    isDeleted: true,
  });

  if (!lesson) return next(new ErrorResponse(404, 'Lesson not found.'));

  res.status(200).json({ success: true, data: {} });
});
