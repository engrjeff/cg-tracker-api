const express = require('express');
const { protect } = require('../middlewares/auth');
const disciple = require('../controllers/disciples');

const router = express.Router();

router.use(protect);

router.route('/').get(disciple.getDisciples).post(disciple.createDisciple);

router
  .route('/:id')
  .get(disciple.getDisciple)
  .put(disciple.updateDisciple)
  .delete(disciple.deleteDisciple);

router.route('/:id/remove').delete(disciple.removeDisciple);

module.exports = router;
