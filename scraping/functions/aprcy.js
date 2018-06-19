const logger    = require('../../modules/logger')('scraping');

const axios     = require('axios');
const cheerio   = require('cheerio');

let Market = () => {
    return {
        website: "",
        statistic: {
            month: {
                visitors: -1,
                views: -1
            },
            week: {
                visitors: -1,
                views: -1
            },
            day: {
                visitors: -1,
                views: -1
            }
        },
        social: {
            total: -1,
            source: [] // {name: '', score: ''}
        }
    }
};


module.exports = (url) => {

    let market = Market();

    market.website = 'https://a.pr-cy.ru/' + url;

    return axios.get(market.website)
        .then(response => {
            let $ = cheerio.load(response.data);

            let statistic = $(".info-test:contains('Открытая статистика')").parent().next().find('tbody'),
                visitors  = statistic.find("td:contains('Посетители')").parent(),
                views     = statistic.find("td:contains('Просмотры')").parent();

            if (visitors !== undefined) {
                market.statistic.day.visitors = visitors.find('td:nth-child(2)').text().trim().replace(/[^0-9]/g, '');
                market.statistic.week.visitors = visitors.find('td:nth-child(3)').text().trim().replace(/[^0-9]/g, '');
                market.statistic.month.visitors = visitors.find('td:last-child').text().trim().replace(/[^0-9]/g, '');
            }

            if (views !== undefined) {
                market.statistic.day.views = views.find('td:nth-child(2)').text().trim().replace(/[^0-9]/g, '');
                market.statistic.week.views = views.find('td:nth-child(3)').text().trim().replace(/[^0-9]/g, '');
                market.statistic.month.views = views.find('td:last-child').text().trim().replace(/[^0-9]/g, '');
            }

            let activity = $(".info-test:contains('Социальная активность')").parent().next();

            market.social.total = activity.find("p:contains('Общая социальная активность составляет')").text((i, text) => {
                text = text.replace(/[^0-9+-]/g, '');
                if (text.search(/\+/i) !== -1) text = text.substring(0, text.search(/\+/i));
                if (text.search(/-/i) !== -1) text = text.substring(0, text.search(/-/i));
                return text
            }).text();

            market.social.source = activity.find("tbody > tr").map((i, el) => {
                return {
                    name: $('.shares-title', el).text().trim(),
                    score:  $('.share', el).text((i, text) => {
                        text = text.replace(/[^0-9+-]/g, '');
                        if (text.search(/\+/i) !== -1) text = text.substring(0, text.search(/\+/i));
                        if (text.search(/-/i) !== -1) text = text.substring(0, text.search(/-/i));
                        return text
                    }).text()
                }
            }).get();

            if (process.env.NODE_ENV === "development")
                logger.info('Success getting market APRCY: `' + url + '`');

            return market;

        })
        .catch(error => {
            logger.error('Could not load market APRCY: `' + url + '`. Error: ' + error);
            return "error";
        });
};