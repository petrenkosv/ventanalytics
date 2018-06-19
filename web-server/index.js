'use strict';

require('dotenv').config();

const logger        = require('../modules/logger')('API');
const express       = require('express');
const bodyParser    = require('body-parser');
const passport      = require('./modules/passport');
const db            = require('../web-server/models');

let app = express();

// Body Parser MW
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// init Passport
app.use(passport().initialize());

/**
 * Cross origin Validation
 */
const allowHeaders = ['access-control-allow-origin','origin','content-type','authorization'];
const allowMethods = ['GET','POST','PUT','DELETE'];

// Add headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', allowHeaders.join(','));
    res.setHeader('Access-Control-Allow-Methods', allowMethods.join(','));

    if (req.method === 'OPTIONS') {
        let isValidHeader = true;
        req.headers['access-control-request-headers'].split(',').map(el => {
            if (allowHeaders.indexOf(el) === -1)
                isValidHeader = false;
        });
        if (isValidHeader && allowMethods.indexOf(req.headers['access-control-request-method']) !== -1)
            return res.send('OK');
    }
    next();
});

app.use('/api', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Origin, Origin, Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    next();
});


/** Initialise Application Routes */
app.use('/', require('./routes'));

app.use('/api', (req, res, next) => {
    res.send("API documentation <a href='https://info.ventanalytics.ru/api'>https://info.ventanalytics.ru/api</a>");
});

// catch 404 for api pages
app.use('/', (req, res, next) => {
    res.status(404).json({
        error: "Not found"
    });
});


/** INIT server */
app.listen(process.env.WEB_SERVER_PORT, async() => {
    /** INIT database */
    // {force: true} - изменит существующие таблицы в БД
    // await db.sequelize.sync({force: true});
    await db.sequelize.sync();

    logger.info('Server Ready! Site: ' + process.env.WEB_SERVER_HOST + ":" + process.env.WEB_SERVER_PORT);

});