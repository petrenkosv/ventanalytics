'use strict';

const Redis      = require('redis');
const logger     = require('../../modules/logger')('VA_LISTING');
const ICO        = require('../models/ICO');
const getSocial  = require('./social');
const categories = ["Blockchain service", "Crypto", "Energy", "Finance", "Game and VR", "High tech", "Insurance", "Marketing", "Security", "Trading"];

/**
 * Get date by week.
 *
 * @param week = current|prev|next
 * @param opt = start|end
 * @return {*}
 */
let getDateByWeek = (week, opt) => {
    let curr = null;
    switch (week) {
        case "current": curr = new Date(); break;
        case "prev": curr = new Date( +new Date() - 7*24*60*60*1000); break;
        case "next": curr = new Date( +new Date() + 7*24*60*60*1000); break;
    }

    if (!curr) return null;

    let first = curr.getDate() - curr.getDay(),
        last = first + 6,
        date = null;

    switch (opt) {
        case "start": date = new Date(curr.setDate(first)); break;
        case "end":  date = new Date(curr.setDate(last)); break;
    }

    if (!date) return null;

    return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
};


/**
 * Get empty listing chart data
 * @return {Object}
 * @private
 */
let getEmptyListingChartData_ = () => {
    return {
        "current": {
            "Blockchain service": 0,
            "Crypto": 0,
            "Energy": 0,
            "Finance": 0,
            "Game and VR": 0,
            "High tech": 0,
            "Insurance": 0,
            "Marketing": 0,
            "Security": 0,
            "Trading": 0
        },
        "next": {
            "Blockchain service": 0,
            "Crypto": 0,
            "Energy": 0,
            "Finance": 0,
            "Game and VR": 0,
            "High tech": 0,
            "Insurance": 0,
            "Marketing": 0,
            "Security": 0,
            "Trading": 0
        }
    }
};

/**
 * Get data of ICOs from mongoDB.
 *
 * @return {Object}
 * @private
 */
let getData_ = async function () {
    let queryCur = {
        icodateend: "{\"from\":\"" + getDateByWeek("current", "start") + "\", \"until\":\"" + getDateByWeek("current", "end") + "\"}",
        fields: "finance.category|links|name",
        limit: 1000
    };
    let queryNext = {
        icodateend: "{\"from\":\"" + getDateByWeek("next", "start") + "\", \"until\":\"" + getDateByWeek("next", "end") + "\"}",
        fields: "finance.category|links|name",
        limit: 1000
    };
    let queryPrev = {
        icodateend: "{\"from\":\"" + getDateByWeek("prev", "start") + "\", \"until\":\"" + getDateByWeek("prev", "end") + "\"}",
        fields: "finance.category|links|name",
        limit: 1000
    };

    let hasError = false;

    let dataCurrent = await ICO.getByQuery(queryCur)
        .then(icos => { return icos })
        .catch(err => { hasError = true; return [] });

    let dataNext = await ICO.getByQuery(queryNext)
        .then(icos => { return icos })
        .catch(err => { hasError = true; return [] });

    let dataPrev = await ICO.getByQuery(queryPrev)
        .then(icos => { return icos })
        .catch(err => { hasError = true; return [] });

    if (hasError) return { error: true };

    return {
        next: dataNext,
        current: dataCurrent,
        prev: dataPrev
    }
};


/**
 * Update listing ICOs.
 *
 * @param redisClient
 * @return {*}
 * @private
 */
let updateListingIcos_ = async (redisClient) => {

    let data = await getData_();
    if (data.error) return data;

    let chartData = getEmptyListingChartData_();

    if (data.current.length) {
        redisClient.del(process.env.REDIS_DATABASE + ":current-icos");
        for (let o in data.current) {
            redisClient.hset(process.env.REDIS_DATABASE + ":current-icos", data.current[o].name, JSON.stringify(data.current[o]));
        }
    }

    if (data.next.length) {
        redisClient.del(process.env.REDIS_DATABASE + ":next-icos");
        for (let o in data.next) {
            redisClient.hset(process.env.REDIS_DATABASE + ":next-icos", data.next[o].name, JSON.stringify(data.next[o]));
        }
    }

    for (let i in data.current) {
        if (categories.indexOf(data.current[i]['finance']['category']) !== -1) {
            chartData["current"][data.current[i]['finance']['category']] += 1
        }
    }

    for (let i in data.next) {
        if (categories.indexOf(data.next[i]['finance']['category']) !== -1) {
            chartData["next"][data.next[i]['finance']['category']] += 1
        }
    }

    redisClient.hset(process.env.REDIS_DATABASE + ":listing-chart", 'next', JSON.stringify(chartData['next']));
    redisClient.hset(process.env.REDIS_DATABASE + ":listing-chart", 'current', JSON.stringify(chartData['current']));

    return data;
};


/**
 *
 * @param links
 * @private
 */
let getSocialScores_ = async (links) => {
    let twitter = links.twitter,
        facebook = links.facebook,
        telegram = links.telegram,
        bitcointalk = links.bitcointalk,
        medium = links.medium,
        reddit = links.reddit;

    try {
        if (!(twitter === "" || twitter === null || twitter === undefined)) {
            twitter = twitter.replace(/\//g, '')
                .replace(/https:twitter.com/i, "")
                .replace(/http:twitter.com/i, "");
        }

        if (!(facebook === "" || facebook === null || facebook === undefined)) {
            facebook = facebook.replace(/\//g, '');
            facebook = facebook
                .replace(/https:facebook.com/i, "")
                .replace(/groups/i, "")
                .replace(/https:fb.me/i, "")
                .replace(/https:fb.com/i, "")
                .replace(/https:web.facebook.com/i, "")
                .replace(/https:business.facebook.com/i, "")
                .replace(/https:www.facebook.com/i, "")
                .replace(/http:www.facebook.com/i, "")
                .replace(/https:m.facebook.com/i, "")
                .replace(/http:fb.me/i, "");
        }

        if (!(telegram === "" || telegram === null || telegram === undefined)) {
            telegram = telegram.replace(/\//g, '')
                .replace(/https:t.me/i, '')
                .replace(/https:telegram.me/i, '')
                .replace(/https:www.t.me/i, '')
                .replace(/https:www.telegram.me/i, '')
                .replace(/http:t.me/i, '')
                .replace(/http:telegram.me/i, '')
                .replace(/http:www.t.me/i, '')
                .replace(/http:www.telegram.me/i, '')
                .replace(/joinchat/i, '')
                .replace(/@/g, '');
        }

        if (!(bitcointalk === "" || bitcointalk === null || bitcointalk === undefined)) {
            bitcointalk = bitcointalk.replace(/\//, '')
                .replace(/https:bitcointalk.org/i, '')
                .replace(/http:bitcointalk.org/i, '')
                .replace(/index.php/i, '')
                .replace(/\?topic=/i, '');

            if (bitcointalk.search(/./) !== -1)
                bitcointalk = bitcointalk.split('.')[0];

            if( !isNaN(parseInt(bitcointalk)) )
                bitcointalk = parseInt(bitcointalk);
            else
                bitcointalk = bitcointalk.replace(/[^0-9]/g, '');
        }

        if (!(medium === "" || medium === null || medium === undefined)) {
            medium = medium.replace(/\//g, '')
                .replace(/https:medium.com/i, '')
                .replace(/@/i, '');

            if (medium.split('/').length > 1) {
                medium = medium.split('/')[0];
            }
            if (medium.split('?').length > 1) {
                medium = medium.split('?')[0];
            }
        }

        if (!(reddit === "" || reddit === null || reddit === undefined)) {
            reddit = reddit.replace(/\//g, '')
                .replace(/https:www.reddit.com/i, '')
                .replace(/user/i, '')
                .replace(/r/i, '');

            if (reddit.split('?').length > 1) {
                reddit = reddit.split('?')[0];
            }
        }
    } catch (err) {
        logger.error("Getting social scores: " + JSON.stringify({ twitter: twitter, telegram: "@"+telegram, facebook: facebook, bitcointalk: bitcointalk, reddit: reddit, medium: "@"+medium }))
    }

    return getSocial({ twitter: twitter, telegram: "@"+telegram, facebook: facebook, bitcointalk: bitcointalk, reddit: reddit, medium: "@"+medium })
        .then(scores => {
            return {
                twitter: scores.twitter && !scores.twitter.error ? scores.twitter.follows : -1,
                telegram: scores.telegram && !scores.telegram.error ? scores.telegram.follows : -1,
                facebook: scores.facebook && !scores.facebook.error ? scores.facebook.follows : -1,
                bitcointalk: scores.bitcointalk && !!scores.bitcointalk.error ? scores.bitcointalk.follows : -1,
                medium: scores.medium && !scores.medium.error ? scores.medium.follows : -1,
                reddit: scores.reddit && !scores.reddit.error ? scores.reddit.follows : -1
            }
        });
};

/**
 * Sleep function.
 *
 * @param sec
 */
let sleep = (sec) => {
    return new Promise(resolve => setTimeout(resolve, 1000 * sec))
};


let updateScore_ = (redisClient, ico, scores) => {
    return new Promise(resolve => {
        redisClient.hget(process.env.REDIS_DATABASE + ":social-scores", ico.name, async (err, data) => {
            if (err || data === null) {
                resolve();
            } else {
                let old_scores = JSON.parse(data);
                if (scores.twitter !== -1 || old_scores.twitter === -1)
                {
                    scores.twitter = old_scores.twitter;
                }
                if (scores.facebook !== -1 || old_scores.facebook === -1)
                {
                    scores.facebook = old_scores.facebook ;
                }
                if (scores.telegram !== -1 || old_scores.telegram === -1)
                {
                    scores.telegram = old_scores.telegram ;
                }
                if (scores.bitcointalk !== -1 || old_scores.bitcointalk === -1)
                {
                    scores.bitcointalk = old_scores.bitcointalk ;
                }
                if (scores.medium !== -1 || old_scores.medium === -1)
                {
                    scores.medium = old_scores.medium ;
                }
                if (scores.reddit !== -1 || old_scores.reddit === -1)
                {
                    scores.reddit = old_scores.reddit ;
                }
                if (scores.reddit === null){
                    scores.reddit = -1;
                }
                await redisClient.hset(process.env.REDIS_DATABASE + ":social-scores", ico.name, JSON.stringify(scores));
                resolve()
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
 * Update social scores.
 *
 * @param redisClient
 * @param data = {current: [], next: []}
 * @return {*}
 * @private
 */
let updateSocialScores_ = async (redisClient, data) => {

    for (let o in data.prev) {
        await redisClient.hdel(process.env.REDIS_DATABASE + ":social-scores" , data.prev[o].name);
    }

    let icos = data.current.concat(data.next);

    for (let o in icos) {
        let scores = await getSocialScores_(icos[ o ].links);
        await sleep(2);
        await updateScore_( redisClient, icos[ o ], scores );
    }
};


module.exports = async () => {

    let redisClient = await Redis.createClient();

    if (process.env.REDIS_PASSWORD !== "")
        await redisClient.auth(process.env.REDIS_PASSWORD);


    let data = await updateListingIcos_(redisClient);

    if (!data.error)
        await updateSocialScores_(redisClient, data);

    if (process.env.NODE_ENV === "development")
        logger.info("Listing data was updated");

    redisClient.quit();
};