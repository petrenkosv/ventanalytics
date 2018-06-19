'use strict';

const logger    = require('../../modules/logger')('scraping');
const ICO   = require('../models/ICO');
const ICObench  = require('../api/icoBench');


/**
 * Get category - one from most used
 * @param categories [Array]
 * @private
 */
const getCategory_ = (categories) => {
    let category = "",
        count = 0,
        counter = {};

    for (let i in categories) {
        for (let cat in ICO.categories) {
            if (ICO.categories[cat].indexOf(categories[i].name) !== -1) {
                if (!counter[cat]) counter[cat] = 0;
                counter[cat]++;
            }
        }
    }

    for (let cat in counter) {
        if (counter[cat] > count)
            category = cat;
    }

    return category;
};


/**
 * Category scraping
 * @returns {Promise}
 */
let categoryFun = () => {
    let ico = new ICObench(),
        page = 0,
        urls = [];

    return new Promise((resolve, reject) => {
        let getPage_ = () => {
            ico.get("icos/all", (data) => {
                if (process.env.NODE_ENV === "development")
                    logger.info('Scraping: `https://icobench.com/icos/all/' + page + '` from ' + data.pages);

                if (data.error) {
                    logger.error('ICOBench error: `' + data.error + '`. Getting from API: `https://icobench.com/icos/all`');
                    setTimeout(() => { getPage_(page) }, 200)
                } else if (data.results === undefined) {
                    setTimeout(() => { getPage_(page) }, 200)
                } else {
                    for (let i = 0; i < data.results.length; i++) {
                        urls.push(data.results[i].url + "#" + data.results[i].id);
                    }
                    if (data.currentPage !== data.pages - 1) {
                        getPage_(page++);
                    } else {
                        resolve(urls);
                    }
                }
            }, {page: page});
        };
        getPage_(page);
    })
};


/**
 * ICO scraping
 * @param url
 * @returns {Promise}
 */
let icoFun = (url) => {

    let icoBench = new ICObench(),
        ico = new ICO['class']();

    return new Promise((resolve, reject) => {

        let getICOData_ = () => {

            icoBench.get("ico/" + url.split('#')[1], data => {
                if (data === undefined) {
                    return resolve(ico);
                }
                if (data.error) {
                    logger.error('ICOBench error: `' + (data === undefined ? undefined : data.error )+ '`. Getting from API: `' + url + '`');
                    setTimeout(() => { getICOData_(url) }, 200)
                } else if (data.links === undefined) {
                    setTimeout(() => { getICOData_(url) }, 200)
                }

                if (data.links === undefined || data.links.www === undefined || data.links.www === null || data.links.www === "") {
                    return resolve(ico);
                }

                ico.set(['name'],  data.name);
                ico.setWebsite(data.links.www);

                ico['resources'].push(url);

                ico.set(['maininfo','intro'],       data.intro);
                ico.set(['maininfo','about'],       data.about);
                ico.set(['maininfo','country'],     data.country);

                ico.set(['finance','token'],        data.finance.token);
                ico.set(['finance','category'],     getCategory_(data.categories));
                ico.set(['finance','tokenType'],    data.finance.tokentype);
                ico.set(['finance','saleTokens'],   data.finance.tokens);
                ico.set(['finance','price'],        (data.finance.price !== '') ? data.finance.price.split(' = ')[1] : '');
                ico.set(['finance','accepting'],    data.finance.accepting);
                ico.set(['finance','hardcap'],      data.finance.hardcap);
                ico.set(['finance','softcap'],      data.finance.softcap);
                ico.set(['finance','bonus'],        data.finance.bonus);
                let distributed = data.finance.distributed.replace(/%/i, '');
                ico.set(['finance','distributed'],  distributed ? parseFloat(distributed).toFixed(1) : -1);

                ico.set(['dates','preIcoStart'],    data.dates.preIcoStart !== "0000-00-00 00:00:00" ? new Date(data.dates.preIcoStart) : null);
                ico.set(['dates','preIcoEnd'],      data.dates.preIcoEnd !== "0000-00-00 00:00:00" ? new Date(data.dates.preIcoEnd) : null);
                ico.set(['dates','icoStart'],       data.dates.icoStart !== "0000-00-00 00:00:00" ? new Date(data.dates.icoStart) : null);
                ico.set(['dates','icoEnd'],         data.dates.icoEnd !== "0000-00-00 00:00:00" ? new Date(data.dates.icoEnd) : null);

                ico.set(['links','whitepaper'],     data.links.whitepaper);
                ico.set(['links','twitter'],        data.links.twitter);
                ico.set(['links','telegram'],       data.links.telegram);
                ico.set(['links','medium'],         data.links.medium);
                ico.set(['links','slack'],          data.links.slack);
                ico.set(['links','reddit'],         data.links.reddit);
                ico.set(['links','facebook'],       data.links.facebook);
                ico.set(['links','github'],         data.links.github);
                ico.set(['links','bitcointalk'],    data.links.bitcointalk);
                ico.set(['links','youtube'],        data.links.youtube);

                ico.set(['bounty','link'],      data.links.bounty);

                ico.set(['team','members'],     data.team.map(el => { return { name: el.name, link: el.links, title: el.title } }));
                ico.set(['team','size'],        data.team.length);

                ico.set(['rating','icobench','total'],      data.rating);
                ico.set(['rating','icobench','profile'],    data.ratingProfile);
                ico.set(['rating','icobench','team'],       data.ratingVision);
                ico.set(['rating','icobench','vision'],     data.ratingVision);
                ico.set(['rating','icobench','product'],    data.ratingProduct);

                ico.milestones = (data.milestones === null || !Array.isArray(data.milestones)) ? [] : data.milestones.map(el => { return { date: el.title, content: el.content } });

                resolve(ico);

            });

        };

        getICOData_();
    });

};

module.exports = {
    categoryFun : categoryFun,
    icoFun  : icoFun
};