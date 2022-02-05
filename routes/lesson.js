const express = require('express');
const lesson = require('../controllers/lesson');
const advancedResults = require('../middlewares/advancedResults');
const { protect, authorize } = require('../middlewares/auth');
const Lesson = require('../models/Lesson');

const populate = {
  path: 'series',
  select: 'title',
};

const router = express.Router();

router.use(protect);
router.use(authorize('admin', 'primary', 'leader'));

router
  .route('/')
  .get(advancedResults(Lesson, populate), lesson.getAll)
  .post(lesson.create);

router.route('/:id').get(lesson.get).put(lesson.update).delete(lesson.delete);

module.exports = router;
