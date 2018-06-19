'use strict';

const axios   = require('axios');
const cheerio = require('cheerio');


/**
 * Count follows on last page in topic
 *
 * @param url {String} - url of last page
 * @returns {Promise}
 * @private
 */
let countFollowers_ = (url) => {
    return axios.get(url)
        .then(response => {
            let $ = cheerio.load(response.data),
                topics = $('.message_number');
            if (topics.length === 0) {
                return {error: "Bitcontalk: no message found"};
            } else {
                return {follows: parseInt($(topics[topics.length-1]).text().replace(/[^0-9.]/g, ''))};
            }
        })
        .catch(error => {
            return {error: "Bitcontalk: error occur on getting followers count: `" + url + "`. " + error};
        });
};


/**
 * Get last page of topic
 *
 * @param topic {String}
 * @returns {Object}
 * @private
 */
module.exports = (topic) => {
    if (topic === "" || topic === null || topic === undefined)
        return {error: "Bitcontalk: topic is not set `" + topic + "`"};

    if (topic.search(/./) !== -1)
        topic = topic.split('.')[0];

    topic = topic.replace(/[^0-9]/g, '');

    let url = 'https://bitcointalk.org/index.php?topic=' + topic + '.0';

    return axios.get(url)
        .then(response => {
            let $ = cheerio.load(response.data),
                table = $('#bodyarea').find('> table');

            if (table.length === 0)
                return {error: "Bitcontalk: no data found on the page"};

            return countFollowers_($(table[0]).find('.prevnext').prev().attr('href'));
        })
        .catch(error => {
            return {error: "Bitcontalk: error occur on getting page: `" + url + "`. " + error};
        });
};