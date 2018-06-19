'use strict';

require('dotenv').config();

const logger        = require('../modules/logger')('WIDGETS');
const express       = require('express');
const db            = require('../web-server/models');

let app = express();

// Routes
app.use('/', require('./routes'));

// catch 404
app.use('/', (req, res, next) => {
    res.status(404).send("Not found");
});

/** INIT server */
app.listen(process.env.WIDGETS_PORT, async () => {

    await db.sequelize.sync();
    
    logger.info('Widgets server ready! Site: ' + process.env.WIDGETS_HOST + ":" + process.env.WIDGETS_PORT);

});