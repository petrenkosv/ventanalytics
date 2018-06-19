const logger    = require('../../modules/logger')('scraping');

const axios     = require('axios');
const cheerio   = require('cheerio');

const uploader  = require('../modules/uploader');

let getResults_ = () => {
    let url = 'https://www.coinschedule.com/icos.html';

    if (process.env.NODE_ENV === "development")
        logger.info('Scraping additional source: `' + url + '`');

    return new Promise((resolve, reject) => {

        let updateICO_ = async (name, price) => {
            let icos = await uploader.collection().find({name: {$regex:".*" + name.toLowerCase() + ".*"}}).toArray();

            price = parseInt(price);

            for (let i in icos) {
                let tmpName = name.toLowerCase().split(' '),
                    icoName = icos[i].name.split(' '),
                    isSame = true;

                for (let j in tmpName) {
                    if (tmpName[j] !== icoName[j]) {
                        isSame = false;
                    }
                }

                if (isSame && !isNaN(price) && parseInt(icos[i].finance.totalMoney) !== price) {
                    uploader.add(icos[i]);
                }
            }

            return "updated";
        };

        axios.get(url)
            .then(responce => {
                let $ = cheerio.load(responce.data);

                $('#tbl_icos').find('tbody > tr').map(async (i, el) => {
                    await updateICO_($("td:first-child", el).text(), $("td:last-child", el).text().replace(/[^0-9]/g, ''));
                });

                resolve();

            })
            .catch(error => {
                logger.error('Could not load source: `' + url + '`. ' + error);
                reject()
            })
    });
};

module.exports = {
    getResults: getResults_
};