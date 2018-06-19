'use strict';

const axios  = require('axios');


/**
 * Count follows in reddit
 *
 * @param pageName {String}
 * @returns {Object}
 * @private
 */
module.exports = (pageName) => {
    if (pageName === "" || pageName === null || pageName === undefined)
        return {error: "Reddit: page name is not set `" + pageName + "`"};

    let url = 'https://www.reddit.com/r/' + pageName + '/about.json';

    return axios.get(url)
        .then(response => {
            return {follows: parseInt(response.data.data.subscribers)}
        })
        .catch(error => {
            return {error: "Reddit: error occur on getting followers count: `" + url + "`. " + error};
        });
};