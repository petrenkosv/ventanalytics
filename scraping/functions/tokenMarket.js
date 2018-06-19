const logger    = require('../../modules/logger')('scraping');
const ICO   = require('../models/ICO');

const axios     = require('axios');
const cheerio   = require('cheerio');

/**
 * Category scraping
 * @param url
 * @returns {Promise}
 */
let categoryFun = (url) => {
    let urls = [];
    return axios.get(url)
        .then(response => {
            let $ = cheerio.load(response.data);
            $('.col-asset-name a').each((i, el) => {
                urls.push($(el).attr('href'));
            });
            return urls
        })
        .catch(error => {
            if (process.env.NODE_ENV === "development")
                logger.error('Could not load url `' + url +'`. ' + error);
            return urls;
        });
};


/**
 * ICO scraping
 * @param url
 * @returns {Promise}
 */
let icoFun = (url) => {

    let ico = new ICO['class']();

    return axios.get(url)
        .then(response => {
            let $ = cheerio.load(response.data);

            let website = $("a:contains('Website')").attr('href');

            if (website !== undefined) {

                ico.set(['name'],  $('h1').text().trim());
                ico.setWebsite(website);

                ico['resources'].push(url);
                ico.set(['maininfo','description'], $("th:contains('Concept')").parent().children('td').text().trim());

                ico.set(['finance','token'],        $("th:contains('Symbol')").parent().children('td').text().trim());

                ico.set(['links','whitepaper'],     $("a:contains('Whitepaper')").attr('href'));
                ico.set(['links','twitter'],        $("a:contains('Twitter')").attr('href'));
                ico.set(['links','telegram'],       $("a:contains('Telegram chat')").attr('href'));
                ico.set(['links','slack'],          $("a:contains('Slack chat')").attr('href'));
                ico.set(['links','linkedin'],       $("a:contains('Linkedin')").attr('href'));
                ico.set(['links','facebook'],       $("a:contains('Facebook')").attr('href'));
                ico.set(['links','github'],         $("a:contains('Github')").attr('href'));
            }

            return ico
        })
        .catch(error => {
            if (process.env.NODE_ENV === "development")
                logger.error('Could not load url `' + url +'`. ' + error);
            return ico;
        });
};

module.exports = {
    categoryFun : categoryFun,
    icoFun  : icoFun
};