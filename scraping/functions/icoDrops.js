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
 * Category scraping
 * @param url
 * @returns {Promise}
 */
let categoryFun = (url) => {
    let urls = [];
    return axios.get(url)
        .then(response => {
            let $ = cheerio.load(response.data);
            $('#ajaxc.all').find('.a_ico h3 > a').each((i, el) => {
                urls.push($(el).attr('href'));
            });
            return urls
        })
        .catch(error => {
            logger.error('Could not load url `' + url +'`. ' + error);
            return urls;
        });
};


/**
 * Ico scraping
 * @param url
 * @returns {Promise}
 */
let icoFun = (url) => {

    let ico = new ICO['class']();

    return axios.get(url)
        .then(response => {
            let $ = cheerio.load(response.data);

            let article = $('article'),
                website = $(".button:contains('WEBSITE')", article).parent().attr('href');

            if (website === undefined) {
                return ico;
            }

            ico.set(['name'],  $('.ico-main-info > h3', article).text().trim());
            ico.setWebsite(website);

            ico['resources'].push(url);

            ico.set(['maininfo','description'], $('.ico-main-info .ico-description', article).text().trim());
            ico.set(['maininfo','company'],     $(".grey:contains('Registered Company:')", article).parent().text((i, text) => { return text.substring(text.indexOf(':')+1, text.length); }).text().trim());

            ico.set(['finance','token'],        $(".grey:contains('Ticker:')", article).parent().text((i, text) => { return text.substring(text.indexOf(':')+1, text.length); }).text().trim());
            ico.set(['finance','category'],     getCategory_($('.ico-main-info > .ico-category-name', article).text((i, text) => { return text.substring(1, text.indexOf(')\n')); }).text().trim()));
            ico.set(['finance','tokenType'],    $(".grey:contains('Token type:')", article).parent().text((i, text) => { return text.substring(text.indexOf(':')+1, text.length); }).text().trim());
            ico.set(['finance','totalTokens'],  $(".grey:contains('Total Tokens:')", article).parent().text((i, text) => { return text.substring(text.indexOf(':')+1, text.length).replace(/[^0-9]/g, ''); }).text().trim());
            ico.set(['finance','salePercent'],  $(".grey:contains('Available for Token Sale:')", article).parent().text((i, text) => { return text.trim().substring(text.indexOf(':')+1, text.length - 1).replace(/,/g, '.'); }).text().trim());
            ico.set(['finance','saleTokens'],   ((ico.finance.totalTokens !== null && ico.finance.salePercent !== null) ? (parseFloat(ico.finance.totalTokens)*parseFloat(ico.finance.salePercent)/100).toFixed(0) : 0));
            ico.set(['finance','price'],        $(".grey:contains('ICO Token Price:')", article).parent().text((i, text) => { if (text.search(/=/) !== -1) text = text.split('=')[1]; if (text !== undefined && text.search(/\(/) !== -1) text = text.split('(')[0]; if (text === undefined) return ""; else return text; }).text().trim());
            ico.set(['finance','accepting'],    $(".grey:contains('Accepts:')", article).parent().text((i, text) => { return text.substring(text.indexOf(':')+1, text.length); }).text().trim());
            ico.set(['finance','tokensRole'],   $(".grey:contains('Role of Token:')", article).parent().text((i, text) => { return text.substring(text.indexOf(':')+1, text.length); }).text().trim());
            ico.set(['finance','hardcap'],      $(".fund-goal > .goal", article).text((i, text) => { return text.substring(text.indexOf('$')+1, text.indexOf('(')).replace(/[^0-9]/g, ''); }).text().trim());
            ico.set(['finance','totalMoney'],   $(".fund-goal > .money-goal", article).text((i, text) => { return text.replace(/[^0-9]/g, ''); }).text().trim());

            ico.set(['links','whitepaper'],     $('.soc_links', article).prev().prev().attr('href'));
            ico.set(['links','twitter'],        $('.soc_links .fa-twitter', article).parent().attr('href'));
            ico.set(['links','telegram'],       $('.soc_links .fa-telegram', article).parent().attr('href'));
            ico.set(['links','medium'],         $('.soc_links .fa-medium', article).parent().attr('href'));
            ico.set(['links','slack'],          $('.soc_links .fa-slack', article).parent().attr('href'));
            ico.set(['links','reddit'],         $('.soc_links .fa-reddit-alien', article).parent().attr('href'));
            ico.set(['links','linkedin'],       $('.soc_links .fa-linkedin', article).parent().attr('href'));
            ico.set(['links','facebook'],       $('.soc_links .fa-facebook-square', article).parent().attr('href'));
            ico.set(['links','github'],         $('.soc_links .fa-github', article).parent().attr('href'));
            ico.set(['links','bitcointalk'],    $('.soc_links .fa-btc', article).parent().attr('href'));
            ico.set(['links','youtube'],        $('.soc_links .fa-youtube', article).parent().attr('href'));

            $("h4:contains('Additional links')", article).closest(".ico-desk").find("a").each((i, el) => {
                ico.additionalLinks[$(el).text().trim().replace(/[^a-zA-Z0-9 ]/g, "")] = $(el).attr('href');
            });

            $("h4:contains('Screenshots')", article).closest(".ico-desk").find("a").each((i, el) => {
                ico.screenShorts[$(el).next().text().trim().replace(/[^a-zA-Z0-9 ]/g, "")] = $(el).attr('href');
            });

            ico.set(['rating','icodrops','totalrate'], $("p:contains('ICO Drps score')", article).parent().find('p:nth-child(2)').text().trim());
            ico.set(['rating','icodrops','hyperate'],  $("p:contains('Hype rate')", article).parent().find('p:nth-child(2)').text().trim());
            ico.set(['rating','icodrops','riskrate'],  $("p:contains('Risk rate')", article).parent().find('p:nth-child(2)').text().trim());
            ico.set(['rating','icodrops','roirate'],   $("p:contains('ROI rate')", article).parent().find('p:nth-child(2)').text().trim());

            return ico
        })
        .catch(error => {
            logger.error('Could not load url `' + url +'`. ' + error);
            return ico;
        });
};


module.exports = {
    categoryFun : categoryFun,
    icoFun  : icoFun,
};