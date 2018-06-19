'use strict';

const axios = require('axios');

const AVAILABLE_ACTIONS = ['ticker', 'global'];
const AVAILABLE_PARAMS = ['start', 'limit', 'convert'];

/**
 * Get ticker
 *
 * @param action = {String}
 * @param options = {Object}
 * @returns {Object}
 * @private
 */
let getTicker_ = (action, options) => {

    if (AVAILABLE_ACTIONS.indexOf(action) === -1)
        return { error: "Unavailable action for Coinmarketcup API." };

    let url = 'https://api.coinmarketcap.com/v1/ticker/',
        params = {};

    for (let ind in options) {
        if (ind === "id" && options[ind] !== undefined)
            url += options[ind];
        else if (AVAILABLE_PARAMS.indexOf(ind) !== -1)
            params[ind] = options[ind];
    }

    return axios.get(url, {
            params: params
        })
        .then(response => {
            return response.data;
        })
        .catch(error => {
            return { error: "Coinmarketcup API error. " + error }
        });
};


/**
 * Get global
 *
 * @param action = {String}
 * @param options = {Object}
 * @returns {Object}
 * @private
 */
let getGlobal_ = (action, options) => {

    if (AVAILABLE_ACTIONS.indexOf(action) === -1)
        return { error: "Unavailable action for Coinmarketcup API." };

    let url = 'https://api.coinmarketcap.com/v1/global/',
        params = {};

    for (let ind in options) {
        if (AVAILABLE_PARAMS.indexOf(ind) !== -1)
            params[ind] = options[ind];
    }

    return axios.get(url)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            return { error: "Coinmarketcup API error. " + error }
        });
};


module.exports = {
    getTicker: getTicker_,
    getGlobal: getGlobal_
};