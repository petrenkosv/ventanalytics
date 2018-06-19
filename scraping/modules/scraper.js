'use strict';

const logger    = require('../../modules/logger')('scraping');
const uploader  = require('../modules/uploader');
const getCourse = require('../api/poloniex');

const ICO   = require('../models/ICO');

let scrapingURLs = [],
    processingScraping = false;


/**
 * Sources which will be scraped
 * @type {Object}
 */
const sources = {
    icoDrops    : 'https://icodrops.com/',
    tokenMarket : 'https://tokenmarket.net/',
    icoBench    : 'https://icobench.com/',
    icoBazaar   : 'https://icobazaar.com/',
    icoRating   : 'https://icorating.com/',
};


/**
 * Link for scraping category in follow order
 */
const categoryOrder = () => {
    return [
        {name:'icoDrops', link:'https://icodrops.com/category/active-ico/'},
        {name:'icoDrops', link:'https://icodrops.com/category/upcoming-ico/'},
        {name:'icoDrops', link:'https://icodrops.com/category/ended-ico/'},
        {name:'tokenMarket', link:'https://tokenmarket.net/blockchain/all-assets?batch_num=0&batch_size=10000'},
        {name:'icoBench', link: 'https://icobench.com/0'},
        //{name:'icoBazaar', link:'https://icobazaar.com/v2/list/all'},
        {name:'icoRating', link:'https://icorating.com/ico/all'},
    ]
};


/**
 * Get source from `sources` by website
 * @param url
 * @returns {null} or {Object}
 */
const getSourceByURL = (url) => {
    if (url === undefined || url === null) {
        return null;
    }
    let protocol = url.split('://')[0],
        hostname = url.split('://')[1].split('/')[0],
        baseURL  = protocol + "://" + hostname + "/",
        source   = null;

    for (let i in sources) {
        if (sources[i] === baseURL) {
            source = i;
        }
    }

    return source;
};


/**
 * Set region by country
 * @param country
 * @private
 */
const setRegion_ = (country) => {
    let result = "";
    if (country !== "" && country !== null && country !== undefined) {
        for (let region in ICO.regions) {
            if (ICO.regions[region].indexOf(country) !== -1) {
                result = region;
            }
        }
    }
    return result;
};


/**
 * Calculate percent of hardcap based on Regression Model
 *
 * @param ico - model of ico
 * @private
 */
const calcPercentOfHardcap_ = (ico) => {

    let constants = {
        _const      : 0.5542334,
        hasPreIco   : -0.0776127,
        hasBounty   : 0.0754775,
        teamLength  : 0.0044529,
        hardcap     : -2.39e-09,
        price       : 0.0004152,
        c1          : 0.1698826,
        c3          : 0.1464008,
        c5          : 0.3993824,
        c6          : 0.1084052,
        c10         : -0.5277906,
        r2          : 0.2256768,
        r3          : 0.1374402,
        r5          : 0.1219936,
        r7          : 0.1494246
    };

    let preIcoStart = ico.dates.preIcoStart !== null ? 1 : 0,
        bounty = ico.bounty.link !== "" ? 1 : 0,
        membersLength = ico.team.members.length === -1 ? 0 : ico.team.members.length,
        hardcap = ico.finance.hardcap === -1 ? 0 : ico.finance.hardcap,
        price = ico.finance.price === null ? 0 : ico.finance.price,
        category = ["Blockchain service", "Crypto", "Energy", "Finance", "Insurance"].indexOf(ico.finance.category) === -1 ? 0 : ico.finance.category,
        region = ["Asia", "Caribbean islands", "East Europe", "North America"].indexOf(ico.maininfo.region) === -1 ? 0 : ico.maininfo.region;

    let score = NaN;

    if (membersLength !== 0 && hardcap !== 0 && price !== 0 && category !== 0 && region !== 0)
    {
        score = constants['_const']
            + constants['hasPreIco']    * preIcoStart
            + constants['hasBounty']    * bounty
            + constants['teamLength']   * membersLength
            + constants['hardcap']      * hardcap
            + constants['price']        * price
            + constants['c1']           * (category === "Blockchain service" ? 1 : 0)
            + constants['c3']           * (category === "Crypto" ? 1 : 0)
            + constants['c5']           * (category === "Energy" ? 1 : 0)
            + constants['c6']           * (category === "Finance" ? 1 : 0)
            + constants['c10']          * (category === "Insurance" ? 1 : 0)
            + constants['r2']           * (region === "Asia" ? 1 : 0)
            + constants['r3']           * (region === "Caribbean islands" ? 1 : 0)
            + constants['r5']           * (region === "East Europe" ? 1 : 0)
            + constants['r7']           * (region === "North America" ? 1 : 0);
    }

    return isNaN(score) ? -1 : score;
};


/**
 * Set course based on price
 *
 * @param type - USD|BTC|ETH
 * @param ticker
 * @param price
 * @param course {object} - from poloniex
 * @private
 */
let convertPrice_ = (course, price, type, ticker) => {
    price = parseFloat(price.replace(/,/g, '.'));
    if (course[type] !== undefined && course[type][ticker] !== undefined && price < 10000) {
        return price * course[type][ticker];
    }
    return NaN;
};


/**
 * Set correct price in USD
 * @param price {String}
 * @param course {Object}
 * @private
 */
let setPrice_ = (price, course) => {

    if (price === "" || price === -1 || typeof price !== "string")
        return -1;

    if (price.search(/<br>/) !== -1) price = price.replace(/<br>/i, "");

    if (price.search(/$/) !== -1) {
        price = price.replace(/[^0-9,.]/g, '').replace(/,/g, '.');
        price = parseFloat(price);
        return isNaN(price) ? -1 : price;
    }

    let arr = price.split(" ");

    switch (arr.length) {
        case 2:
            if (arr[0].search(/-/) !== -1)
                arr[0] = arr[0].split('-')[0];

            if (arr[1] === "USD") {
                price = arr[0].replace(/,/g, '.');
            }
            else {
                price = convertPrice_(course, arr[0], "USD", arr[1]);
            }
            break;
        case 4:
            if (arr[1] === "-") {
                if (arr[3] === "USD") {
                    price = arr[0].replace(/,/g, '.');
                }
                else {
                    price = convertPrice_(course, arr[0], "USD", arr[3]);
                }
            }
            else {
                price = NaN;
            }
            break;
    }

    return isNaN(price) ? -1 : parseFloat(price);

};


/**
 * Get additional info for all icos
 * - market info
 * - github info
 * - totalMoney and hardcap info
 * @private
 */
let getAdditionalInfoForICOs_ = async () => {

    try {
        await require('../functions/coinSchedule').getResults();
        await require('../functions/icoWatchList').getData();
    } catch (error) {
        logger.error("Additional sources do not complete their work. " + error);
    }

    let icos = await uploader.collection().find().toArray();
    let course   = await getCourse();

    let ico = null;

    while (icos.length > 0) {

        ico = icos.shift();

        // Set region
        ico.maininfo.region = await setRegion_(ico.maininfo.country);

        // Set price
        ico.finance.price = await setPrice_(ico.finance.price, course);


        // Change errors
        ico.finance.totalTokens = (ico.finance.totalTokens !== 'NaN' && ico.finance.totalTokens !== '')? parseInt(ico.finance.totalTokens) :-1;
        ico.finance.saleTokens  = (ico.finance.saleTokens !== 'NaN' && ico.finance.saleTokens !== '') ? parseInt(ico.finance.saleTokens) :-1;
        ico.finance.salePercent = (ico.finance.salePercent !== 'NaN' && ico.finance.salePercent !== '') ? parseInt(ico.finance.salePercent) :-1;
        ico.finance.totalMoney  = (ico.finance.totalMoney !== 'NaN' && ico.finance.totalMoney !== '') ? parseInt(ico.finance.totalMoney) :-1;
        ico.finance.hardcap     = (ico.finance.hardcap !== 'NaN' && ico.finance.hardcap !== '') ? parseInt(ico.finance.hardcap) :-1;
        ico.finance.softcap     = (ico.finance.softcap !== 'NaN' && ico.finance.softcap !== '') ? parseInt(ico.finance.softcap) :-1;
        ico.finance.distributed = ico.finance.distributed !== 'NaN' ? ((ico.finance.totalMoney !== null && ico.finance.hardcap !== null) ? (ico.finance.totalMoney / ico.finance.hardcap * 100).toFixed(0) : -1) : -1;


        // Update ratings
        ico.rating.ventanalytics.p_hardcap = calcPercentOfHardcap_(ico);

        uploader.add(ico);
    }

    logger.info("Finished daily work");

};


/**
 * Scraping ico based on link from daily scraping
 * @private
 */
let scrapingICO_ = () => {

    if (processingScraping || scrapingURLs.length === 0) {
        return;
    }

    processingScraping = true;

    let scraping = async () => {

        if (!uploader.isConnected())
            await uploader.connect();

        let url = scrapingURLs.shift(),
            source = getSourceByURL(url),
            ico = null;

        if (process.env.NODE_ENV === "development") {
            logger.info(scrapingURLs.length + ' URLs left (scraping)');
            logger.info('Scraping ico: `' + url + "`");
        }

        switch (source) {
            case "icoDrops":
                ico = await require('../functions/icoDrops').icoFun(url);
                break;
            case "tokenMarket":
                ico = await require('../functions/tokenMarket').icoFun(url);
                break;
            case "icoBench":
                ico = await require('../functions/icoBench').icoFun(url);
                break;
            case "icoBazaar":
                ico = await require('../functions/icoBazaar').icoFun(url);
                break;
            case "icoRating":
                if (url.search('details') !== -1) {
                    ico = await require('../functions/icoRating').detailsFun(url);
                } else {
                    ico = await require('../functions/icoRating').icoFun(url);
                }
                break;
        }

        if (ico !== null && ico !== undefined && !(ico.website === "" || ico.website === null || ico.website === undefined)) {
            uploader.add(ico);
        }

        if (scrapingURLs.length > 0) {
            scraping();
        } else {
            if (process.env.NODE_ENV === "development")
                logger.info('All icos are scraped');

            processingScraping = false;
            getAdditionalInfoForICOs_();
        }
    };

    scraping();

};


/**
 * Get all urls for scraping icos
 * @private
 */
let doDailyScraping_ = async () => {

    logger.info("Start daily scraping");

    let categorySources = categoryOrder();

    while (categorySources.length > 0) {

        let url = categorySources.shift().link,
            source = getSourceByURL(url),
            urls = [];

        if (process.env.NODE_ENV === 'development')
            logger.info('Scraping category: `' + url + '`');


        switch (source) {
            case "icoDrops":
                urls = await require('../functions/icoDrops').categoryFun(url);
                break;
            case "tokenMarket":
                urls = await require('../functions/tokenMarket').categoryFun(url);
                break;
            case "icoBench":
                urls = await require('../functions/icoBench').categoryFun();
                break;
            case "icoBazaar":
                urls = await require('../functions/icoBazaar').categoryFun(url);
                break;
            case "icoRating":
                urls = await require('../functions/icoRating').categoryFun(url);
                break;
        }

        scrapingURLs = scrapingURLs.concat(urls);

        scrapingICO_();
    }

};


module.exports = {
    initUploader: async () => { await uploader.init() },
    doScraping: doDailyScraping_
};