'use strict';

require('dotenv').config();

const db = require('../web-server/models');
const scraper = require('./modules/scraper');
const createTokenIndex = require('./modules/token-index');
const listingIcos = require('./modules/listing-icos');


let init = async () => {

    await db.sequelize.sync();

    await scraper.initUploader();
    scraper.doScraping();
    setInterval(() => { scraper.doScraping() }, 1000 * 60 * process.env.SCRAPER_INTERVAL);

    createTokenIndex();
    setInterval(() => { createTokenIndex() }, 1000 * 60 * process.env.TOKEN_INDEX_INTERVAL);

    listingIcos();
    setInterval(() => { listingIcos() }, 1000 * 60 * process.env.LISTING_ICOS_INTERVAL)

};

init();

