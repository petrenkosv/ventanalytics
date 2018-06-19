'use strict';

const Telegram      = require('../api/telegram');
const countTwitter  = require('../api/twitter');
const countFacebook = require('../api/facebook');
const countMedium   = require('../api/medium');
const countReddit   = require('../api/reddit');
const countBitcointalk = require('../api/bitcointalk');


module.exports = (inQuery) => {
    return new Promise( async (resolve, reject) => {
        let result      = null,
            response    = {},
            format      = inQuery.format === "excelAPI" ? "excelAPI" : "json",
            telegram    = inQuery.telegram ? inQuery.telegram : null,
            twitter     = inQuery.twitter ? inQuery.twitter : null,
            facebook    = inQuery.facebook ? inQuery.facebook : null,
            medium      = inQuery.medium ? inQuery.medium : null,
            reddit      = inQuery.reddit ? inQuery.reddit : null,
            bitcointalk = inQuery.bitcointalk ? inQuery.bitcointalk : null;

        try {

            if (telegram) {
                response['telegram'] = {};
                if (telegram.split('|').length > 1) {
                    telegram = telegram.split('|');
                    for (let i in telegram) {
                        if (telegram[i] !== "" && telegram[i] !== undefined && telegram[i] !== null)
                            response['telegram'][telegram[i]] = await Telegram.getChatMembersCount(telegram[i]);
                    }
                }
                else {
                    response['telegram'] = await Telegram.getChatMembersCount(telegram);
                }
            }

            if (twitter) {
                response['twitter'] = {};
                if (twitter.split('|').length > 1) {
                    twitter = twitter.split('|');
                    for (let i in twitter) {
                        if (twitter[i] !== "" && twitter[i] !== undefined && twitter[i] !== null)
                            response['twitter'][twitter[i]] = await countTwitter(twitter[i]);
                    }
                }
                else {
                    response['twitter'] = await countTwitter(twitter);
                }
            }

            if (facebook) {
                response['facebook'] = {};
                if (facebook.split('|').length > 1) {
                    facebook = facebook.split('|');
                    for (let i in facebook) {
                        if (facebook[i] !== "" && facebook[i] !== undefined && facebook[i] !== null)
                            response['facebook'][facebook[i]] = await countFacebook(facebook[i]);
                    }
                }
                else {
                    response['facebook'] = await countFacebook(facebook);
                }
            }

            if (medium) {
                response['medium'] = {};
                if (medium.split('|').length > 1) {
                    medium = medium.split('|');
                    for (let i in medium) {
                        if (medium[i] !== "" && medium[i] !== undefined && medium[i] !== null)
                            response['medium'][medium[i]] = await countMedium(medium[i]);
                    }
                }
                else {
                    response['medium'] = await countMedium(medium);
                }
            }

            if (reddit) {
                response['reddit'] = {};
                if (reddit.split('|').length > 1) {
                    reddit = reddit.split('|');
                    for (let i in reddit) {
                        if (reddit[i] !== "" && reddit[i] !== undefined && reddit[i] !== null)
                            response['reddit'][reddit[i]] = await countReddit(reddit[i]);
                    }
                }
                else {
                    response['reddit'] = await countReddit(reddit);
                }
            }

            if (bitcointalk) {
                response['bitcointalk'] = {};
                if (bitcointalk.split('|').length > 1) {
                    bitcointalk = bitcointalk.split('|');
                    for (let i in bitcointalk) {
                        if (bitcointalk[i] !== "" && bitcointalk[i] !== undefined && bitcointalk[i] !== null)
                            response['bitcointalk'][bitcointalk[i]] = await countBitcointalk(bitcointalk[i]);
                    }
                }
                else {
                    response['bitcointalk'] = await countBitcointalk(bitcointalk);
                }
            }

        } catch (error) {

            reject(error)

        }

        if (format === "excelAPI") {
            result = {};
            let keys = Object.keys(response);
            for (let i in keys) {
                if (typeof response[keys[i]] === "object") {
                    let keys1 = Object.keys(response[keys[i]]);
                    for (let j in keys1) {
                        if (typeof response[keys[i]][keys1[j]] === "object") {
                            let keys2 = Object.keys(response[keys[i]][keys1[j]]);
                            for (let k in keys2) {
                                result[keys[i] + "." + keys1[j] + "." + keys2[k]] = response[keys[i]][keys1[j]][keys2[k]];
                            }
                        }
                        else {
                            result[keys[i] + "." + keys1[j]] = response[keys[i]][keys1[j]];
                        }
                    }
                }
                else {
                    result[keys[i]] = response[keys[i]];
                }
            }
        } else {
            result = response;
        }

        resolve(result);

    });
};