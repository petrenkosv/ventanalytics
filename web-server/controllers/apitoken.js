'use strict';

const crypto    = require('crypto');
const { Op }    = require('sequelize');
const db        = require('../models');

/**
 * Create token API
 *
 * @param id - user ID
 * @returns {Promise}
 * @private
 */
let create_ = async (id) => {
    let user = await db['users'].findOne({
        where: { id: id },
        include: ["tokens_api"]
    });

    if (!user) return;

    user = user.toJSON();

    if (user.tokens_api && user.tokens_api.length !== 0)
        return { error: "Token API already exist" };

    let tokenHash = crypto.createHmac('sha256', process.env.TOKEN_API_SECRET).update(user.id + +new Date()).digest('hex');

    let token = await db['tokens_api'].create({
        token: tokenHash,
        user_id: user.id,
        active: true,
        limits: 50,
        valid_date: new Date(+new Date + 10*24*60*60*1000)
    });

    await db['tokens_api_history'].create({
        token: tokenHash
    });

    return token;
};


/**
 * Update token API.
 *
 * @param tokenHash
 * @param data {JSON}
 * @return {Promise}
 * @private
 */
let update_ = async (tokenHash, data) => {
    let token = await db['tokens_api'].findOne({
        where: { token: tokenHash }
    });

    if (!token) return;

    return await token.updateAttributes({
        active: data.active || token.getDataValue('active'),
        requests: data.requests || token.getDataValue('requests'),
        limits: data.limits || token.getDataValue('limits'),
        valid_date: data.valid_date || token.getDataValue('valid_date')
    });
};


/**
 * Get history by tokenHash.
 *
 * @param userId
 * @param tokenHash
 * @param query
 * @returns {Promise}
 * @private
 */
let getHistory_ = async (userId, tokenHash, query) => {
    let token = await db['tokens_api'].findOne({
        where: { token: tokenHash, user_id: userId },
        include: [{
            model: db['tokens_api_history'],
            as: 'tokens_api_history',
            where: {
                created_at: {
                    [Op.gte] : query.from || '1970-01-01',
                    [Op.lte] : query.until || new Date()
                }
            },
            limit: query.limit || 365,
            order: [['created_at', 'DESC']]
        }]
    });

    if (!token) return;

    return token.getDataValue('tokens_api_history')
};


module.exports = {
    create: create_,
    update: update_,
    getHistory: getHistory_
};