'use strict';

const express = require('express');
const router  = express.Router();

const passport = require('../modules/passport');

// API requests from any host, contains `?access_token=` in query
router.use('/api/token-index', passport().authenticateAPI(), require('../../widgets/routes_data/token-index'));
router.use('/api', passport().authenticateAPI(), require('../../scraping/routes'));

// Scraping routes for JWT
router.use('/scraping', passport().authenticateJWT(), require('../../scraping/routes'));

// Free routes for return data without limits
router.use('/widgets', require('../../widgets/routes_data'));

// JWT request from client-side application
router.use('/auth',        require('./auth'));
router.use('/user',        passport().authenticateJWT(), require('./user'));
router.use('/user/admin',  passport().authenticateJWT(), require('./admin'));

module.exports = router;