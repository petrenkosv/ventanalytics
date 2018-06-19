const logger    = require('../../modules/logger')('scraping');
const uploader  = require('../modules/uploader');

const axios     = require('axios');
const cheerio   = require('cheerio');


let updateICO_ = async (website, price) => {
    let ico = await uploader.collection().find({website: {$regex:".*" + website }}).toArray();

    if (ico.length !== 0 && price !== '') {
        ico[0].finance.totalMoney = parseInt(price);
        uploader.add(ico[0]);
    }

    return "updated";
};

let getICO_ = (url) => {

    return axios.get(url)
        .then(async responce => {
            let $ = cheerio.load(responce.data);

            let website = $('a[data-page="homepage"]').attr('href');

            if (website !== undefined) {
                let protocol = "http://",
                    site = null;
                if (website.split('//').length > 1) {
                    protocol = website.split('//')[0];
                    site = website.split('//')[1];
                }

                if (site === null) site = website;

                if (site.split('/').length > 1) site = site.split('/')[0];
                if (site.split('?').length > 1) site = site.split('?')[0];

                website = protocol + '//' + site;

                await updateICO_(website, $('p.price-open').text().replace(/[^0-9]/g, ''));
            }

            return "success";
        })
        .catch(error => {
            logger.error('Could not load source: `' + url + '`. ' + error);
            return "error";
        })
};


let getAllICOs_ = () => {
    let url = 'https://icowatchlist.com/finished',
        links = [];

    if (process.env.NODE_ENV === "development")
        logger.info('Scraping additional source: `' + url + '`');

    return axios.get(url)
        .then(responce => {
            let $ = cheerio.load(responce.data);
            $('.main-ico-table').find('tbody .logo-div a').map((i, el) => {
                links.push('https://icowatchlist.com/' + $(el).attr('href'));
            });
            return links;
        })
        .catch(error => {
            logger.error('Could not load source: `' + url + '`. Error: ' + JSON.stringify(error));
            return links;
        })
};

let getData_ = async () => {
    let links = await getAllICOs_();

    for (let i in links) {
        if (process.env.NODE_ENV === "development") {
            logger.info((links.length - i) + ' URLs left (scraping icoWatchList)');
            logger.info('Scraping additional source: `' + links[i] + '`');
        }
        await getICO_(links[i]);
    }

    return "success";
};

module.exports = {
    getData: getData_
};