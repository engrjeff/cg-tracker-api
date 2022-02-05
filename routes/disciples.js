const express = require('express');
const { protect, authorize } = require('../middlewares/auth');
const advancedResults = require('../middlewares/advancedResults');
const disciple = require('../controllers/disciples');
const Disciple = require('../models/Disciple');

const router = express.Router();

const populate = {
  path: 'leader',
  select: 'name',
};

router.use(protect);
router.use(authorize('admin', 'primary', 'leader'));

router.route('/me').get(disciple.getForUser);

router
  .route('/')
  .get(advancedResults(Disciple, populate), disciple.getAll)
  .post(disciple.create);

router
  .route('/:id')
  .get(disciple.get)
  .put(disciple.update)
  .delete(disciple.delete);

router.route('/:id/remove').delete(disciple.remove);

module.exports = router;
