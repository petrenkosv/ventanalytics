'use strict';

const express = require('express');
const router  = express.Router();
const path      = require("path");

router.use('/analytics', require('./collection'));


router.get('/token-index', async (req, res, next) => {
    res.sendFile(path.join(__dirname, "..", "pages", "token-index.html"));
});

router.get('/total-money', async (req, res, next) => {
    res.sendFile(path.join(__dirname, "..", "pages", "total-money.html"));
});

router.get('/listing-chart', async (req, res, next) => {
    res.sendFile(path.join(__dirname, "..", "pages", "listing-chart.html"));
});

module.exports = router;