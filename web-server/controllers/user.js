'use strict';

const crypto    = require('crypto');
const { Op }    = require('sequelize');
const db        = require('../models');
const Auth      = require('../modules/auth');

/**
 * Get all users
 *
 * @param query - query params
 * @returns {Promise}
 * @private
 */
let getAllUsers_ = async (query) => {

    let status = !query.status || isNaN(query.status) ? null : query.status,
        name = query.name;

    let where = {};

    if (status)
        where['status'] = status;

    if (name)
        where[Op.or] = {
            name: name.trim(),
            email: name.trim().toLowerCase(),
            username: name.trim().toLowerCase()
        };

    return await db['users'].findAll({
        where: where,
        order: [['created_at','ASC']]
    });

};


/**
 * Get user data
 *
 * @param id - user ID
 * @returns {Promise}
 * @private
 */
let getUser_ = async (id) => {

    let user = await db['users'].findOne({
            where: {
                id: id
            },
            include: ["permissions", "tokens_api"]
        });

    if (!user) return;

    let date = +new Date();
    user = user.toJSON();
    user.permissionsArray = user.permissions;

    let permissions = [];
    user.permissions.forEach(permisson => {
        if (+permisson.toJSON().expires_in > date && user.status < 2)
            permissions.push(permisson.getModule())
    });

    user.permissions = permissions;

    return user;
};


/**
 * Update user data
 *
 * @param id - user ID
 * @param data {JSON}
 * @returns {Promise}
 * @private
 */
let updateUser_ = async (id, data) => {

    let user = await db['users'].findOne({
            where: {
                id: id
            }
        });

    if (!user) return;

    if (data.name === user.getDataValue('name') &&
        data.email === user.getDataValue('email') &&
        data.username === user.getDataValue('username'))
    {
        return "Nothing changes";
    }

    let status = user.getDataValue('status');
    if (data.email !== user.getDataValue('email')) {
        status = 0;
    }

    await user.updateAttributes({
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        username: data.username.trim().toLowerCase(),
        status: status
    });

    return user;
};


/**
 * Delete user
 *
 * @param id - user ID
 * @returns {Promise}
 * @private
 */
let deleteUser_ = async (id) => {
    let user = await db['users'].findOne({
            where: {
                id: id
            }
        });

    if (!user) return;

    await Auth.deleteRefreshTokens(id);

    await user.updateAttributes({
        status: 3
    });

    await user.destroy();

    return user;
};


/**
 * Block user
 *
 * @param id - user ID
 * @returns {Promise}
 * @private
 */
let blockUser_ = async (id) => {
    let user = await db['users'].findOne({
        where: {
            id: id
        }
    });

    if (!user) return;

    await Auth.deleteRefreshTokens(id);

    await user.updateAttributes({
        status: 2
    });

    return user;
};


/**
 * Unblock user
 *
 * @param id - user ID
 * @returns {Promise}
 * @private
 */
let unBlockUser_ = async (id) => {
    let user = await db['users'].findOne({
        where: {
            id: id
        }
    });

    if (!user) return;

    await Auth.deleteRefreshTokens(id);

    await user.updateAttributes({
        status: 0
    });

    return user;
};


/**
 * Change user password
 *
 * @param id - user ID
 * @param data {JSON}
 * @returns {Promise}
 * @private
 */
let changePassword_ = async (id, data) => {
    let user = await db['users'].findOne({
            where: {
                id: id
            }
        });

    if (!user) return;

    let password = crypto.createHmac('sha256', process.env.PASSWORD_SECRET).update(data.password).digest('hex');

    if (password === user.getDataValue('password')) {
        return "same"
    }

    await user.updateAttributes({
        password: password
    });

    return user;
};


module.exports = {
    getAllUsers: getAllUsers_,
    getUser : getUser_,
    updateUser: updateUser_,
    deleteUser: deleteUser_,
    blockUser: blockUser_,
    unBlockUser: unBlockUser_,
    changePassword: changePassword_
};