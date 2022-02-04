const express = require('express');
const auth = require('../controllers/auth');

const { authenticateLoginToken } = require('../middlewares/auth');

const router = express.Router();

router.post('/register', authenticateLoginToken, auth.register);
router.post('/login', authenticateLoginToken, auth.login);
router.post('/forgotpassword', auth.forgotPassword);
router.post('/resetpassword', auth.resetPassword);
router.post('/changepassword', auth.changePassword);

module.exports = router;
