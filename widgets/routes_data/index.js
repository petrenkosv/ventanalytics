'use strict';

const express = require('express');
const router  = express.Router();

router.use('/token-index', require('./token-index'));
router.use('/total-money', require('./total-money'));
router.use('/listing-chart', require('./listing-chart'));
router.use('/social-score', require('./social-score'));
router.use('/visitors', require('./visitors'));

module.exports = router;