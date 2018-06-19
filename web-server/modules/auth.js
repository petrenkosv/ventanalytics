'use strict';

const jwt       = require('jsonwebtoken');
const crypto    = require('crypto');
const Redis     = require('redis');
const db        = require('../models');
let redisClient = null;

const AUTH_HEADER   = 'authorization';
const BEARER        = "bearer";


let connectRedis = async () => {
    redisClient = await Redis.createClient();
    if (process.env.REDIS_PASSWORD !== "")
        await redisClient.auth(process.env.REDIS_PASSWORD);
    return redisClient;
};


/**
 * Create token by type.
 *
 * @param type - access|refresh
 * @param user - Model_User
 * @returns {String}
 * @private
 */
let generateToken_ = async (type, user) => {

    if (!redisClient)
        await connectRedis();

    let token = null;

    if (type === "refresh") {

        token = await jwt.sign({
            id: user.id
        }, process.env.JWT_REFRESH_SECRET, {
            algorithm: "HS256",
            expiresIn: process.env.JWT_REFRESH_EXPIRE
        });

        await redisClient.sadd(process.env.REDIS_DATABASE + ":refresh-tokens:" + user.id, token);
        await redisClient.expire(process.env.REDIS_DATABASE + ":refresh-tokens:" + user.id, process.env.JWT_REFRESH_EXPIRE_SECONDS)
    }

    if (type === "access") {

        token = await jwt.sign({
            id: user.id
        }, process.env.JWT_ACCESS_SECRET, {
            algorithm: "HS256",
            expiresIn: process.env.JWT_ACCESS_EXPIRE
        });

    }

    return token;
};


/**
 * Check jwt spelling
 *
 * @param value {String}
 * @returns {Object}
 */
function checkJWTFormat_(value) {
    if (typeof value !== 'string') {
        return null;
    }
    let matches = value.match(/(\S+)\s+(\S+)/);
    return matches && { scheme: matches[1], value: matches[2] };
}


/**
 * Check api token spelling
 *
 * @param value {String}
 * @returns {Object}
 */
function checkAPITokenFormat_(value) {
    if (typeof value !== 'string' || value.length !== 64) {
        return null;
    }
    return value;
}


/**
 * Generate confirmation link and store it in Redis.
 *
 * @param user - Model_User
 * @returns {String}
 * @private
 */
let createConfirmationLink_ = async (user) => {

    if (!redisClient)
        await connectRedis();

    let hash = crypto.createHmac('sha256', process.env.APP_SECRET).update(user.id + +new Date()).digest('hex');

    redisClient.set(process.env.REDIS_DATABASE + ":confirmation:" + hash, user.id, "EX", process.env.CONFIRMATION_EXPIRE / 1000);

    return hash;
};


/**
 * Check confirmation link
 *
 * @param hash {String}
 * @returns userId|null
 * @private
 */
let checkConfirmationLink_ = async (hash) => {

    if (!redisClient)
        await connectRedis();

    return new Promise(resolve => {
        redisClient.get(process.env.REDIS_DATABASE + ":confirmation:" + hash, (err,data) => {
            if (err)
                resolve(null);
            else
                resolve(data);
        });
    });
};


/**
 * Delete confirmation link
 *
 * @param hash {String}
 * @param userId
 * @private
 */
let deleteConfirmationLink_ = async (hash, userId) => {
    if (!redisClient)
        await connectRedis();

    await redisClient.del(process.env.REDIS_DATABASE + ":refresh-tokens:" + userId);
    await redisClient.del(process.env.REDIS_DATABASE + ":confirmation:" + hash);

    return "success";
};


/**
 * Generate reset link and store it in Redis.
 *
 * @param user - Model_User
 * @returns {String}
 * @private
 */
let createResetLink_ = async (user) => {

    if (!redisClient)
        await connectRedis();

    let hash = crypto.createHmac('sha256', process.env.APP_SECRET).update(user.id + +new Date()).digest('hex');

    redisClient.set(process.env.REDIS_DATABASE + ":reset:" + hash, user.id, "EX", process.env.RESET_EXPIRE / 1000);

    return hash;
};


/**
 * Check reset link
 *
 * @param hash {String}
 * @returns userId|null
 * @private
 */
let checkResetLink_ = async (hash) => {

    if (!redisClient)
        await connectRedis();

    return new Promise(resolve => {
        redisClient.get(process.env.REDIS_DATABASE + ":reset:" + hash, (err,data) => {
            if (err)
                resolve(null);
            else
                resolve(data);
        });
    });
};


/**
 * Delete reset link
 *
 * @param hash {String}
 * @param userId
 * @private
 */
let deleteResetLink_ = async (hash, userId) => {
    if (!redisClient)
        await connectRedis();

    await redisClient.del(process.env.REDIS_DATABASE + ":refresh-tokens:" + userId);
    await redisClient.del(process.env.REDIS_DATABASE + ":reset:" + hash);

    return "success";
};


/**
 * Get start of date
 *
 * @param date
 * @private
 */
let getStartOfDate_ = (date) => {
    return new Date(date.getFullYear() + '-' + (date.getMonth() + 1) + "-" + date.getDate());
};


/**
 * Set API token inactive.
 *
 * @param token
 * @return {Promise}
 * @private
 */
let setAPITokenInactive_ = async (token) => {
    await token.updateAttributes({
        active: false
    })
};


/**
 * Check API token
 *
 * @param tokenHash
 * @private
 */
let checkAPIToken_ = async (tokenHash) => {
    let token = await db['tokens_api'].findOne({
        where: { token: tokenHash },
        include: ['tokens_api_history']
    });
    if (!token)
        return "not-found";
    if (!token.getDataValue('active'))
        return "not-active";

    if (token.getDataValue('requests') >= token.getDataValue('limits')) {
        await setAPITokenInactive_(token);
        return "requests-limits";
    }
    if (+token.getDataValue('valid_date') < +new Date()) {
        // TODO check if exist new package with subscribe | if exist => update request, limits, valid_date
        await setAPITokenInactive_(token);
        return "valid-date-error";
    }

    await db['tokens_api'].increment('requests', {
        by: 1, where: { token: tokenHash }
    });

    let history = token.getDataValue('tokens_api_history');

    history = history[history.length - 1];

    if (+getStartOfDate_(new Date()) > +getStartOfDate_(history.created_at))
    {
        await db['tokens_api_history'].create({
            token: token.getDataValue('token'),
            requests: 1
        });
    }
    else {
        await history.updateAttributes({
            requests: parseInt(history.getDataValue('requests')) + 1
        });
    }

    return token.getDataValue('user_id');
};


/**
 * Refresh tokens
 *      - if !refresh_token or exp refresh_token date is not valid => return error
 *      - else create new access_token and refresh_token
 *
 * @param headers
 * @returns {String|Object}
 * @private
 */
let refreshTokens_ = async (headers) => {
    if (!redisClient)
        await connectRedis();

    let token = null;

    let authParams = checkJWTFormat_(headers[AUTH_HEADER]);

    if (authParams && BEARER === authParams.scheme.toLowerCase())
        token = authParams.value;

    if (!token)
        return "no-token";

    try {
        let decode = jwt.verify(token, process.env.JWT_REFRESH_SECRET, { ignoreExpiration: true });

        if (decode.exp < (+new Date() / 1000 - 30))
            return "expired";

        return new Promise(resolve => {
            redisClient.smembers(process.env.REDIS_DATABASE + ":refresh-tokens:" + decode.id, async (err, tokens) => {
                if (err)
                    return resolve("error");

                let index = tokens.indexOf(token);

                if (index !== -1)
                    await redisClient.srem(process.env.REDIS_DATABASE + ":refresh-tokens:" + decode.id, tokens[index]);

                resolve({
                    access_token: await generateToken_('access', decode),
                    refresh_token: await generateToken_('refresh', decode)
                })
            });
        });
    } catch (error) {
        return "error";
    }

};


/**
 * Get permissions for user
 *
 * @param user - uuid
 * @returns {Array}
 * @private
 */
let getPermissions_ = async (user) => {

    let permissions = await db['permissions'].findAll({
        where: { user_id: user }
    });

    if (permissions.length === 0) return permissions;

    let date = +new Date(),
        result = [];

    for (let i in permissions) {
        if (+permissions[i].toJSON().expires_in > date)
            result.push(permissions[i].getModule());
    }


    return result;
};

let deleteRefreshTokens_ = async (user) => {
    if (!redisClient)
        await connectRedis();

    try {
        await redisClient.del(process.env.REDIS_DATABASE + ":refresh-tokens:" + user);
        return "success";
    } catch (error) {
        return "error";
    }
};

module.exports = {
    generateToken: generateToken_,
    createConfirmationLink: createConfirmationLink_,
    checkConfirmationLink: checkConfirmationLink_,
    deleteConfirmationLink: deleteConfirmationLink_,
    createResetLink: createResetLink_,
    checkResetLink: checkResetLink_,
    deleteResetLink: deleteResetLink_,
    checkAPIToken: checkAPIToken_,
    refreshTokens: refreshTokens_,
    deleteRefreshTokens: deleteRefreshTokens_,
    checkAPIFormat: checkAPITokenFormat_,
    getPermissions: getPermissions_
};