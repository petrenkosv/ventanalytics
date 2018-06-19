const logger    = require('../../modules/logger')('scraping');
const ICO   = require('../models/ICO');

const axios     = require('axios');
const cheerio   = require('cheerio');


/**
 * Get category by string
 * @param category [String]
 * @private
 */
const getCategory_ = (category) => {
    for (let cat in ICO.categories) {
        if (ICO.categories[cat].indexOf(category) !== -1) {
            return cat;
        }
    }
    return "";
};


/**
 * Category parser
 * @param url
 * @returns {Promise}
 */
let categoryFun = (url) => {
    let urls = [];
    return axios.get(url)
        .then(response => {
            let $ = cheerio.load(response.data);

            $("h2:contains('Investment Rating')").next().find('tbody tr').map((i, el) => {
                urls.push($(el).attr('data-href'));
                urls.push($(el).attr('data-href') + 'details/');
            });
            $("h2:contains('Unassessed')").next().find('tbody tr').map((i, el) => {
                urls.push($(el).attr('data-href'));
                urls.push($(el).attr('data-href') + 'details/');
            });
            return urls
        })
        .catch(error => {
            logger.error('Could not load url `' + url +'`. ' + error);
            return urls;
        });
};


let icoFun = (url) => {

    let ico = new ICO['class']();

    return axios.get(url)
        .then(response => {
            let $ = cheerio.load(response.data);

            let name    = $('h1').text().trim(),
                website = $("td:contains('Website:')").next().find('a').attr('href');

            if (name === "404 - page not found" || website === undefined) {
                return ico;
            }
            ico.set(['name'],  name);
            ico.setWebsite(website);

            ico['resources'].push(url);

            ico.set(['maininfo','description'], $("td:contains('Description:')").next().text().trim());

            ico.set(['finance','category'],     getCategory_($("td:contains('Industry:')").next().text().trim()));

            ico.set(['features','content'],     $("td:contains('Features:')").next().text().trim());
            ico.set(['features','techDetails'], $("td:contains('Technical details:')").next().text().trim());


            let social = $("h3:contains('Social')").closest('[uk-grid]').find('.social');

            if (social) {
                ico.set(['links','whitepaper'],     "https://icorating.com" + $("td:contains('Whitepaper:')").next().find('a').attr('href'));
                ico.set(['links','twitter'],        $("span:contains(' Twitter')", social).parent().attr('href'));
                ico.set(['links','telegram'],       $("span:contains(' Telegram')", social).parent().attr('href'));
                ico.set(['links','medium'],         $("span:contains(' Medium')", social).parent().attr('href'));
                ico.set(['links','slack'],          $("span:contains(' Slack')", social).parent().attr('href'));
                ico.set(['links','reddit'],         $("span:contains(' Reddit')", social).parent().attr('href'));
                ico.set(['links','linkedin'],       $("span:contains(' Linkedin')", social).parent().attr('href'));
                ico.set(['links','facebook'],       $("span:contains(' Facebook')", social).parent().attr('href'));
                ico.set(['links','github'],         $("span:contains(' Github')", social).parent().attr('href'));
                ico.set(['links','bitcointalk'],    $("span:contains(' btctalk')", social).parent().attr('href'));
                ico.set(['links','youtube'],        $("span:contains(' Youtube')", social).parent().attr('href'));
            }

            let rating = $(".title:contains('Investment rating')").parent();

            if (rating) {
                let score = rating.find('.score').text().trim();

                ico.set(['rating','icorating','investment'],  ((score.search(/\//) !== -1) ? score.split('/')[0].trim() : -1));

                rating = $(".title:contains('Hype score')").parent();
                score = rating.find('.score').text().trim();
                ico.set(['rating','icorating','hypescore'],   ((score.search(/\//) !== -1) ? score.split('/')[0].trim() : -1));

                rating = $(".title:contains('Risk score')").parent();
                score = rating.find('.score').text().trim();
                ico.set(['rating','icorating','riskscore'],   ((score.search(/\//) !== -1) ? score.split('/')[0].trim() : -1));
            }

            return ico;
        })
        .catch(error => {
            logger.error('Could not load url `' + url +'`. ' + error);
            return ico;
        });
};


let detailsFun = (url) => {

    let ico = new ICO['class']();

    return axios.get(url)
        .then(response => {
            let $ = cheerio.load(response.data);

            let crowdsale   = $("h3:contains('Crowdsale')").closest('[uk-grid]'),
                social      = $("h3:contains('Social')").closest('[uk-grid]').find('.social');

            let name    = $('h1').text().trim(),
                website = $("span:contains(' Website')", social).parent().attr('href');

            if (name === "404 - page not found" || website === undefined) {
                return ico;
            }

            ico.set(['name'],  name);
            ico.setWebsite(website);

            ico['resources'].push(url);

            if (crowdsale) {
                ico.set(['finance','token'],        $("td:contains('Ticker:')", crowdsale).next().text().trim());
                ico.set(['finance','tokenType'],    $("td:contains('Token Standard:')", crowdsale).next().text().trim());
                ico.set(['finance','emission'],     $("td:contains('Additional Token Emission:')", crowdsale).next().text().trim());
                ico.set(['finance','accepting'],    $("td:contains('Accepted Currencies:')", crowdsale).next().text().trim());
                ico.set(['finance','bonus'],        $("td:contains('Bonus Program:')", crowdsale).next().text().trim() !== undefined);
                ico.set(['finance','hardcap'],      $("td:contains('Hard cap size:')", crowdsale).next().text().trim());

                let price = $("td:contains('Token price in ETH:')", crowdsale).next().text().trim();
                ico.set(['finance','price'],        (price !== "") ? price.split(' = ')[1] : "");
                ico.set(['finance','dividends'],    $("td:contains('Dividends:')", crowdsale).next().text().trim());

                ico.distribution = $("td:contains('Token distribution:')", crowdsale).next().text().trim();

                let preIcoStart = $("td:contains('Pre-ICO start date:')", crowdsale).next().text().trim(),
                    date = "";
                if (preIcoStart === "") {
                    ico.dates.preIcoStart = null
                } else {
                    date = preIcoStart.split('.');
                    ico.dates.preIcoStart = new Date(date[2], date[1]-1, date[0]);
                }

                let preIcoEnd = $("td:contains('Pre-ICO end date:')", crowdsale).next().text().trim();
                if (preIcoEnd === "") {
                    ico.dates.preIcoEnd = null
                } else {
                    date = preIcoEnd.split('.');
                    ico.dates.preIcoEnd = new Date(date[2], date[1]-1, date[0]);
                }

                date = $("td:contains('ICO start date:')", crowdsale).next().text().trim();
                if (date === "") {
                    ico.dates.icoStart = null
                } else {
                    if (preIcoStart !== "") {
                        date = date.split(preIcoStart)[1];
                    }
                    date = date.split('.');
                    ico.dates.icoStart = new Date(date[2], date[1]-1, date[0]);
                }

                date = $("td:contains('ICO end date:')", crowdsale).next().text().trim();
                if (date === "") {
                    ico.dates.icoEnd = null
                } else {
                    if (preIcoEnd !== "") {
                        date = date.split(preIcoEnd)[1];
                    }
                    date = date.split('.');
                    ico.dates.icoEnd = new Date(date[2], date[1]-1, date[0]);
                }

            }

            let bounty = $("h3:contains('Bounty')");
            if (bounty !== undefined) {
                ico.set(['bounty','scheme'],     bounty.closest("[uk-grid]").find('.uk-table tbody tr').map((i, el) => { return $('td', el).map((j, el1) => { return $(el1).text() }).get().join(' ') }).get().join(', '));
            }

            if (social) {
                ico.set(['links','twitter'],        $("span:contains(' Twitter')", social).parent().attr('href'));
                ico.set(['links','telegram'],       $("span:contains(' Telegram')", social).parent().attr('href'));
                ico.set(['links','medium'],         $("span:contains(' Medium')", social).parent().attr('href'));
                ico.set(['links','slack'],          $("span:contains(' Slack')", social).parent().attr('href'));
                ico.set(['links','reddit'],         $("span:contains(' Reddit')", social).parent().attr('href'));
                ico.set(['links','linkedin'],       $("span:contains(' Linkedin')", social).parent().attr('href'));
                ico.set(['links','facebook'],       $("span:contains(' Facebook')", social).parent().attr('href'));
                ico.set(['links','github'],         $("span:contains(' Github')", social).parent().attr('href'));
                ico.set(['links','bitcointalk'],    $("span:contains(' btctalk')", social).parent().attr('href'));
                ico.set(['links','youtube'],        $("span:contains(' Youtube')", social).parent().attr('href'));
            }
            return ico;
        })
        .catch(error => {
            logger.error('Could not load url `' + url +'`. ' + error);
            return ico;
        });
};


module.exports = {
    categoryFun : categoryFun,
    icoFun  : icoFun,
    detailsFun  : detailsFun
};