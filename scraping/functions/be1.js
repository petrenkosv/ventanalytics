const logger    = require('../../modules/logger')('scraping');

const axios     = require('axios');
const cheerio   = require('cheerio');

let Market = () => {
    return {
        website: "",
        traffic: {
            direct: "",
            referrals: "",
            search: "",
            social: "",
            mail: ""
        },
        indexing: {
            yandex: "",
            google: ""
        },
        referrals: [], // top 5 {name: '', score: ''}
        social: []  // top 5 {name: '', score: ''}
    };
};


module.exports = (url) => {

    let market = Market();

    market.website = 'https://be1.ru/stat/' + url;

    return axios.get(market.website)
        .then(response => {
            let $ = cheerio.load(response.data);

            // traffic
            $('script').map((i, el) => {
                let script   = $(el).html(),
                    traffic  = script.search(/SimslarTraficDrawChart/i),
                    indStart = 0,
                    indEnd   = 0;

                if (traffic !== -1) {
                    script = script.replace(/\n/g, '');
                    script = script.replace(/\t/g, '');
                    script = script.replace(/\/\//g, '');

                    indStart = script.search(/arrayToDataTable\(/i) + 17;
                    indEnd   = script.search(/var options/i) - 2;

                    script = script.substring(indStart, indEnd).split('],[');

                    for (let i in script) {
                        switch (script[i].split(',')[0]) {
                            case "'Директ'":
                                market.traffic.direct = (parseFloat(script[i].split(',')[1].trim()) * 100).toFixed(2);
                                break;
                            case "'Реферальные ссылки'":
                                market.traffic.referrals = (parseFloat(script[i].split(',')[1].trim()) * 100).toFixed(2);
                                break;
                            case "'Поиск'":
                                market.traffic.search = (parseFloat(script[i].split(',')[1].trim()) * 100).toFixed(2);
                                break;
                            case "'Социальные сети'":
                                market.traffic.social = (parseFloat(script[i].split(',')[1].trim()) * 100).toFixed(2);
                                break;
                            case "'Почтовая рассылка'":
                                market.traffic.mail = (parseFloat(script[i].split(',')[1].trim()) * 100).toFixed(2);
                                break;
                        }

                    }

                }
            });

            // fill referrals and social
            let refArea     = $("th:contains('Топ входящих')").parent().parent(),
                socialArea  = $("h3:contains('Социальный трафик')").parent().parent().parent(),
                indexYandex = $('#set_pages_in_yandex').text().trim(),
                indexGoogle = $('#set_pages_in_google').text().trim();

            if (indexYandex !== undefined) {
                market.indexing.yandex = indexYandex;
            }

            if (indexGoogle !== undefined) {
                market.indexing.google = indexGoogle;
            }

            $('tr', refArea).map((i, el) => {
                if (i !== 0 && $(el).text().trim() !== "") {
                    if ($('td:nth-child(2)', el).text().trim() !== "нет данных") {
                        market.referrals.push({
                            name : $('td:nth-child(2)', el).text().trim(),
                            score: $('td:nth-child(3)', el).text().trim().replace(/%/i, '')
                        })
                    }
                }
            });

            $('.row', socialArea).map((i, el) => {
                if (i !== 0 && $(el).text().trim() !== "") {
                    market.social.push({
                        name  : $('.padding_top3', el).text().trim(),
                        score : $('.social-count .value', el).text().trim().replace(/%/i, '')
                    })
                }
            });

            if (process.env.NODE_ENV === "development")
                logger.info('Success getting market BE1: `' + url + '`');

            return market;

        })
        .catch(error => {
            logger.error('Could not load market BE1: `' + url + '`. Error: ' + error);
            return "error";
        });
};