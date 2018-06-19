'use strict';

const Facebook = require('facebook-node-sdk');

const facebook = new Facebook({ appId: process.env.FACEBOOK_APP_ID, secret: process.env.FACEBOOK_SECRET });


/**
 * Count fan_count like follows in facebook
 *
 * @param pageName {String}
 * @returns {Object}
 * @private
 */
module.exports = (pageName) => {
    if (pageName === "" || pageName === null || pageName === undefined)
        return {error: "Facebook: page name is not set `" + pageName+ "`"};

    return new Promise(async (resolve, reject) => {
            facebook.api('/' + pageName + '/?fields=fan_count', (err, data) => {
                if (err) reject(err);
                else resolve(data)
            });
        })
        .then(data => {
            return {follows: data.fan_count}
        })
        .catch(error => {
            return {error: "Facebook: error occur on getting fan count: `" + pageName + "`. " + error.message};
        });
};