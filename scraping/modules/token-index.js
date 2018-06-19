'use strict';

const Redis     = require('redis');

const logger        = require('../../modules/logger')('TOKEN-INDEX');
const coinmarketcap = require('../api/coinmarketcap');
const db            = require('../../web-server/models');

// TODO добавить CRUD для администрирования token-indexes - добавление тикеров (по id c coinmarketcap) + редактироваание коэфицентов и цены на начало ico
// redisClient.sadd(process.env.REDIS_DATABASE + ":token-indexes:tickers", "bitcoin");
// redisClient.hset(process.env.REDIS_DATABASE + ":token-indexes:coeff", 'bitcoin', '{"capCoeff":"0.5","icoPrice":"0.123"}');

const dayIndexesArr = [5,10,15,20,25,30,35,40,45,50,55,0],
    weekIndexesArr = [15,30,45,0];


/**
 * Get tickers from DB
 *
 * @redisClient
 * @returns {Array}
 * @private
 */
let getTickers_ = (redisClient) => {

    return new Promise((resolve,reject) => {
        redisClient.smembers(process.env.REDIS_DATABASE + ":token-indexes:tickers" , (err, tickers) => {
            if (err) {
                reject(err);
            } else if (tickers === null) {
                resolve([]);
            } else {
                resolve(tickers);
            }
        })
    })
    .catch(error => {
        if (process.env.NODE_ENV === "development")
            logger.error("Redis getting all tickers error. " + error);
        return []
    })
};


/**
 * Get all coeff rom DB
 *
 * @param redisClient
 * @returns {Object}
 * @private
 */
let getCoeff_ = (redisClient) => {

    return new Promise((resolve,reject) => {
        redisClient.hgetall(process.env.REDIS_DATABASE + ":token-indexes:coeff" , (err, tickers) => {
            if (err) {
                reject(err);
            } else if (tickers === null){
                resolve({});
            } else {
                resolve(tickers)
            }
        })
    })
    .catch(error => {
        if (process.env.NODE_ENV === "development")
            logger.error("Redis getting all coeff error. " + error);
        return {}
    });
};


/**
 * Add index to DB
 *
 * @param index = {Number}
 * @private
 */
let addIndexToDB_ = (index) => {

    let date = new Date();

    date.setMilliseconds(0);
    date.setSeconds(0);
    date.setMinutes(Math.round((Math.round(date.getSeconds()/60) + date.getMinutes())/5) * 5);

    return db['token-indexes'].create({
        mode_day     : dayIndexesArr.indexOf(date.getMinutes()) !== -1,
        mode_week    : weekIndexesArr.indexOf(date.getMinutes()) !== -1,
        mode_month   : date.getMinutes() === 0 && date.getHours() === 0,
        mode_quarter : date.getMinutes() === 0 && date.getHours() === 0,
        mode_year    : date.getMinutes() === 0 && date.getHours() === 0,
        label        : date,
        value        : index,
    })
};


/**
 * Calculate index
 *
 * @param redisClient
 * @param tickers
 * @param coeffes
 * @returns {Number}
 */
let calculateIndex = async (redisClient, tickers, coeffes) => {

    let ticker = null,
        coeff  = null,
        capCoeff = null,
        icoPrice = null,
        curCap = 0,
        icoCap = 1;

    let sum = 0;

    for (let i in tickers) {
        ticker = await coinmarketcap.getTicker('ticker', { id: tickers[i] });
        coeff  = coeffes[tickers[i]];

        if (coeff !== undefined && ticker.error === undefined) {
            ticker = ticker[0];
            coeff = JSON.parse(coeff.replace(/&#34;/g,'"'));

            capCoeff = parseFloat(coeff['capCoeff']);
            icoPrice = parseFloat(coeff['icoPrice']);

            if (!isNaN(capCoeff) && !isNaN(icoPrice)) {
                sum += capCoeff * parseFloat(ticker['price_usd']) * parseFloat(ticker['available_supply']) / icoPrice * parseFloat(ticker['available_supply'])
                curCap += capCoeff * parseFloat(ticker['price_usd']) * parseFloat(ticker['available_supply']);
                icoCap += icoPrice * parseFloat(ticker['available_supply']);
            }
        }
    }

    return (coeffes['first'] * coeffes['second'] * curCap / icoCap).toFixed(2);

};


module.exports = async () => {

    let redisClient = await Redis.createClient();

    if (process.env.REDIS_PASSWORD !== "")
        await redisClient.auth(process.env.REDIS_PASSWORD);

    await addIndexToDB_(
        await calculateIndex(
            redisClient,
            await getTickers_(redisClient),
            await getCoeff_(redisClient))
    );

    if (process.env.NODE_ENV === "development")
        logger.info("Index created");

    redisClient.quit();
};