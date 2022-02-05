const express = require('express');
const series = require('../controllers/series');
const { protect, authorize } = require('../middlewares/auth');
const advancedResults = require('../middlewares/advancedResults');
const Series = require('../models/Series');

const router = express.Router();

router.use(protect);
router.use(authorize('admin', 'primary', 'leader'));

router
  .route('/')
  .get(advancedResults(Series, 'lessons'), series.getAll)
  .post(series.create);

router.route('/:id').get(series.get).put(series.update).delete(series.delete);

module.exports = router;
