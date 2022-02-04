const express = require('express');
const router = express.Router();

const { getUsers } = require('../controllers/user');
const { protect } = require('../middlewares/auth');

router.route('/').get(protect, getUsers);

module.exports = router;
