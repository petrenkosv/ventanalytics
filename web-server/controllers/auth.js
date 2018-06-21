'use strict';

const crypto      = require('crypto');
const { Op }      = require('sequelize');
const authModule  = require('../modules/auth');
const db          = require('../models');
const Nodemailer  = require('../modules/nodemailer');


/**
 * Register new user
 *
 * @param data
 * @returns {Promise}
 * @private
 */
let register_ = async (data) => {

    let user = await db['users'].findOne({
        where: {
            [Op.or]: {
                username: data.username.trim().toLowerCase(),
                email: data.email.trim().toLowerCase()
            }
        }
    });

    if (user && user.toJSON().username)
        return "existed";

    let password = crypto.createHmac('sha256', process.env.PASSWORD_SECRET).update(data.password.trim()).digest('hex');

    user = await db['users'].create({
        name    : data.name.trim(),
        username: data.username.trim().toLowerCase(),
        email   : data.email.trim().toLowerCase(),
        password: password,
        status  : 0
    });

    user = user.toJSON();

    let hash = await authModule.createConfirmationLink(user);

    let mailOptions = {
        from: process.env.NODEMAILER_EMAIL,
        to: user.email,
        subject: '[VA] Account Registration', // Subject line
        html: '<p><b>Hello ' + user.name + '</b></p>' +
            '<p>To finish activating your account and submit email you should click this link: ' +
            '<a href="' + process.env.WEB_CLIENT_HOST + ":" + process.env.WEB_CLIENT_PORT + "/#/confirm?hash=" + hash +'">' +
                    process.env.WEB_CLIENT_HOST + ":" + process.env.WEB_CLIENT_PORT + "/#/confirm?hash=" + hash + '</a>'  +
            '</p><p>Thank you</p>'
    };

//    await Nodemailer.sendMail(mailOptions);

    return user
};


/**
 * Login - create tokens
 *
 * @param data
 * @returns {Promise}
 * @private
 */
let login_ = async (data) => {
    let user = await db['users'].findOne({
        where: {
            username: data.username.trim().toLowerCase(),
            password: crypto.createHmac('sha256', process.env.PASSWORD_SECRET).update(data.password.trim()).digest('hex')
        }
    });

    if (!user) return;

    if (user.status === 2) return "blocked";

    return {
        access_token: await authModule.generateToken('access', user),
        refresh_token: await authModule.generateToken('refresh', user)
    }
};


/**
 * Reset password
 *
 * @param data
 * @returns {Promise}
 * @private
 */
let reset_ = async (data) => {

    let user = await db['users'].findOne({
        where: {
            email: data.email,
        }
    });

    if (!user) return;

    user = user.toJSON();

    let hash = await authModule.createResetLink(user);

    let mailOptions = {
        from: process.env.NODEMAILER_EMAIL,
        to: user.email,
        subject: '[VA] Forgotten Password',
        html: '<p><b>Hello ' + user.name + '</b></p>' +
            '<p>You (or someone who knows your email address) has requested a password reset on your account. ' +
            'To complete the reset and change your password, you click this link: ' +
            '<a href="' + process.env.WEB_CLIENT_HOST + ":" + process.env.WEB_CLIENT_PORT + "/#/recovery?hash=" + hash +'">' +
                process.env.WEB_CLIENT_HOST + ":" + process.env.WEB_CLIENT_PORT + "/#/recovery?hash=" + hash + '</a></p>'  +
            '<p>If you did not request the reset then you can just ignore this email.</p>' +
            '<p>Thank you</p>'
    };

//    await Nodemailer.sendMail(mailOptions);

    return "success";
};


/**
 * Recovery access to account
 *
 * @param data
 * @returns {Promise}
 * @private
 */
let recovery_ = async (data) => {

    let userId = await authModule.checkResetLink(data.hash);

    if (!userId) return "invalid-hash";

    let user = await db['users'].findOne({
        where: {
            id: userId
        }
    });

    if (!user) return "deleted";

    if (user.toJSON().status === 2) return "blocked";

    let password = crypto.createHmac('sha256', process.env.PASSWORD_SECRET).update(data.password).digest('hex');

    if (user.toJSON().password === password) return "same-password";

    user = await user.updateAttributes({ password: password });

    user = user.toJSON();

    await authModule.deleteResetLink(data.hash, user.id);

    return {
        access_token: await authModule.generateToken('access', user),
        refresh_token: await authModule.generateToken('refresh', user)
    }
};


/**
 * Confirm email
 *
 * @param hash
 * @returns {Promise}
 * @private
 */
let confirmEmail_ = async (hash) => {

    let userId = await authModule.checkConfirmationLink(hash);

    if (!userId) return "invalid-hash";

    let user = await db['users'].findOne({
        where: {
            id: userId
        }
    });

    if (!user) return "deleted";

    if (user.toJSON().status === 2) return "blocked";

    user = await user.updateAttributes({ status: 1 });

    user = user.toJSON();

    await authModule.deleteConfirmationLink(hash, user.id);

    return {
        access_token: await authModule.generateToken('access', user),
        refresh_token: await authModule.generateToken('refresh', user)
    }
};


/**
 * Refresh tokens
 *
 * @param headers - Headers
 * @returns {Promise}
 * @private
 */
let refreshTokens_ = async (headers) => {
    return await authModule.refreshTokens(headers);
};


module.exports = {
    register: register_,
    login: login_,
    reset: reset_,
    recovery: recovery_,
    confirmEmail: confirmEmail_,
    refreshTokens: refreshTokens_
};
