'use strict';

const axios  = require('axios');


/**
 * Count follows in twitter
 *
 * @param pageName {String}
 * @returns {Object}
 * @private
 */
module.exports = (pageName) => {
    if (pageName === "" || pageName === null || pageName === undefined)
        return {error: "Twitter: page name is not set `" + pageName + "`"};

    let url = 'https://cdn.syndication.twimg.com/widgets/followbutton/info.json?screen_names=' + pageName;

    return axios.get(url)
        .then(response => {
            return {follows: parseInt(response.data[0]['followers_count'])}
        })
        .catch(error => {
            return {error: "Twitter: error occur on getting followers count: `" + url + "`. " + error};
        });
};