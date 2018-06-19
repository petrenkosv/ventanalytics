const logger    = require('../../modules/logger')('scraping');
const ICO   = require('../models/ICO');

const axios     = require('axios');
const cheerio   = require('cheerio');

/**
 * Category parser
 * @param url
 * @returns {Promise}
 */
let categoryFun = (url) => {
    let script = undefined,
        urls = [];

    return axios.get(url)
        .then(response => {
            let $ = cheerio.load(response.data);

            $('script').map((i, el) => {
                if ( $(el).html().search(/window.__NUXT__/i) !== -1 ) {
                    script = $(el).html();
                }
            });

            let start = script.search(/"icos":/i) + 7,
                end   = script.search(/"error":/i) - 3;

            if (script[end] !== "}") end--;

            script = JSON.parse(script.substring(start, end));

            let sitename = url.split('/list/')[0];

            for (let i in script) {
                urls.push(sitename + script[i].link);
            }

            return urls;
        })
        .catch(error => {
            logger.error('Could not load url `' + url +'`. ' + error);
            return urls;
        });
};


let icoFun = (url) => {
    let ico = new ICO['class']();

    return axios.get('https://api.icobazaar.com/api/v2/icolist', {
            params: {
                link: url.split('/v2/')[1],
                limit: 1
            }
        })
        .then(response => {
            let data = response.data;

            if (data.length === 0) {
                return ico;
            }

            data = data[0];

            ico.set(['name'],  data.document.details.name);
            ico.setWebsite(data.document.details.links.website);

            ico['resources'].push(url);

            ico.set(['maininfo','description'], data.document.details.brief);

            ico.set(['finance','token'],        data.document.payment.tokenName);

            ico.set(['dates','icoStart'],       !(data.document.details.start === null || data.document.details.start === undefined) ? new Date(data.document.details.start) : null);
            ico.set(['dates','icoEnd'],         !(data.document.details.end === null || data.document.details.end === undefined) ? new Date(data.document.details.end) : null);

            if (data.document.payment.prices && data.document.payment.prices.length > 0) {
                ico.set(['finance','price'],    data.document.payment.prices[data.document.payment.prices.length - 1].price + " " + data.document.payment.baseCurrency.toUpperCase());
            }

            ico.set(['finance','totalTokens'],     data.document.payment.tokenSupply);
            ico.set(['finance','saleTokens'],      data.document.payment.tokenOnSale);
            ico.set(['finance','salePercent'],     (ico.finance.totalTokens && ico.finance.saleTokens) ? (parseFloat(ico.finance.saleTokens)/parseFloat(ico.finance.totalTokens)).toFixed(0) : -1);
            ico.set(['wallets','btc'],           data.document.payment.address !== undefined ? data.document.payment.address.btc : "");
            ico.set(['wallets','eth'],           data.document.payment.address !== undefined ? data.document.payment.address.eth : "");

            let team = data.document.team.items;
            if (team && team.length > 0) {
                for (let i in team) {
                    ico.team.members.push({
                        name:   team[i].name,
                        link:   (team[i].links && team[i].links.linkedin) ? team[i].links.linkedin : '',
                        title:  team[i].job
                    });
                }
                ico.set(['team','size'], team.length);
            }

            ico.set(['links','whitepaper'],     data.document.details.whitepaper);
            ico.set(['links','twitter'],        data.document.details.links.twitter);
            ico.set(['links','telegram'],       data.document.details.links.telegram);
            ico.set(['links','medium'],         data.document.details.links.medium);
            ico.set(['links','slack'],          data.document.details.links.slack);
            ico.set(['links','reddit'],         data.document.details.links.reddit);
            ico.set(['links','linkedin'],       data.document.details.links.linkedin);
            ico.set(['links','facebook'],       data.document.details.links.facebook);
            ico.set(['links','github'],         data.document.details.links.github);
            ico.set(['links','crunchbase'],     data.document.details.links.crunchbase);
            ico.set(['links','bitcointalk'],    data.document.details.links.bitcointalk);
            ico.set(['links','youtube'],        data.document.details.links.youtube);

            let roadmap = data.document.roadmap;
            if (roadmap.items && roadmap.items.length > 0) {
                roadmap = roadmap.items;
                for (let i in roadmap) {
                    ico.milestones.push({
                        date: roadmap[i].date,
                        content: roadmap[i].heading + ". " + roadmap[i].text
                    });
                }
            }

            ico.set(['rating','icobazaar','total'],         data.rating);
            ico.set(['rating','icobazaar','site'],          data.rating_details ? data.rating_details.site : "");
            ico.set(['rating','icobazaar','team'],          data.rating_details ? data.rating_details.team : "");
            ico.set(['rating','icobazaar','idea'],          data.rating_details ? data.rating_details.idea : "");
            ico.set(['rating','icobazaar','media'],         data.rating_details ? data.rating_details.media : "");
            ico.set(['rating','icobazaar','technology'],    data.rating_details ? data.rating_details.technology : "");

            return ico;
        })
        .catch(error => {
            logger.error('Could not load url `' + url +'`. ' + error);
            return ico;
        });
};


module.exports = {
    categoryFun : categoryFun,
    icoFun  : icoFun
};