const express = require('express');
const router  = express.Router();

router.use('/ico', require('./ico'));
router.use('/market', require('./market'));
router.use('/github', require('./github'));
router.use('/social', require('./social'));

module.exports = router;