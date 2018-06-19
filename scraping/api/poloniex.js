'use strict';

const axios  = require('axios');


module.exports = () => {

    return axios.get('https://poloniex.com/public', {
            params:{
                command: "returnTicker"
            }
        })
        .then(response => {

            let data = response.data,
                result = { BTC: {}, ETH: {}, USD: {} };

            for (let ticker in data) {

                switch (ticker.split("_")[0]) {
                    case "BTC":
                        result["BTC"][ticker.split("_")[1]] = 1 / data[ticker].last;
                        break;
                    case "ETH":
                        result["ETH"][ticker.split("_")[1]] = 1 / data[ticker].last;
                        break;
                    case "USDT":
                        result["USD"][ticker.split("_")[1]] = 1 / data[ticker].last;
                        break;
                }

            }
            return result;
        })
        .catch(error => {
            return { error: "Could not load data from POLONIEX. " + error };
        });
};