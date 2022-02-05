const asyncHandler = require('../utils/asyncHandler');

const advancedResults = (model, populate) =>
  asyncHandler(async (req, res, next) => {
    const reqQuery = { ...req.query };

    const excludedFields = ['select', 'sortBy', 'page', 'limit'];

    excludedFields.forEach((field) => delete reqQuery[field]);

    // ONLY admin can access the deleted resource
    if (req.user.role !== 'admin') reqQuery.isDeleted = false;

    let query = model.find(reqQuery);

    // SELECTING FIELDS
    if (req.query.select) {
      query = query.select(req.query.select.split(',').join(' '));
    }

    if (populate) {
      query = query.populate(populate);
    }

    // SORTING
    if (req.query.sortBy) {
      const sortBy = req.query.sortBy.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // PAGINATION
    const total = await model.countDocuments();
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || total;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    if (req.query.limit) query = query.skip(startIndex).limit(limit);

    const results = await query;

    // PAGINATION RESULT
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    res.advancedResults = {
      success: true,
      count: results.length,
      pagination,
      total,
      data: results,
    };

    next();
  });

module.exports = advancedResults;
