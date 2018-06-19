'use strict';

const express   = require('express');
const cAuth     = require('../controllers/auth');
const router    = express.Router();

const Recaptcha = require('express-recaptcha').Recaptcha;
const recaptcha = new Recaptcha(process.env.RECAPTCHA_SITE_KEY, process.env.RECAPTCHA_SECRET_KEY);

/**
 * Sign Up router
 *
 * @example auth/signup
 */
router.post('/signup', recaptcha.middleware.verify, async (req, res, next) => {

    if (req.recaptcha.error)
        return res.json( { error: "ReCaptcha is not valid" } );

    if (!req.body.name || req.body.name === "")
        return res.json( { error: "Name field could not be empty" } );

    if (!req.body.username || req.body.username === "")
        return res.json( { error: "Username field could not be empty" } );

    if (!req.body.email || req.body.email === "" || !/^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(req.body.email))
        return res.json( { error: "Error email format" } );

    if (!req.body.password || req.body.password === "")
        return res.json( { error: "Password field could not be empty" } );

    try {
        let user = await cAuth.register(req.body);

        if (user === "existed")
            return res.json( { error: "User with such email or username exist" } );

        res.json({
            message: "Success sign up. Confirmation link send to email"
        });

    } catch (error) {
        res.status(500).json( { error: "Server error: " + error } )
    }
});


/**
 * Sign In router
 *
 * @example auth/signin
 */
router.post('/signin', async (req, res, next) => {

    if (!req.body.username || req.body.username === "")
        return res.json( { error: "Username field could not be empty" } );

    if (!req.body.password || req.body.password === "")
        return res.json( { error: "Password field could not be empty" } );

    try {
        let userTokens = await cAuth.login(req.body);

        if (!userTokens)
            return res.json( { error: "User with such username does not exist." } );
        else if (userTokens === "blocked")
            return res.json( { message: "User was blocked, contact with administrator." } );

        res.json({
            message: "Successfully sign in",
            data: {
                access_token: userTokens.access_token,
                refresh_token: userTokens.refresh_token
            }
        })

    } catch (error) {
        res.status(500).json( { error: "Server error: " + error } )
    }
});


/**
 * Reset password router
 *
 * @example auth/reset
 */
router.post('/reset', recaptcha.middleware.verify, async (req, res, next) => {

    if (req.recaptcha.error)
        return res.json( { error: "ReCaptcha is not valid" } );

    if (!req.body.email || req.body.email === "" || !/^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(req.body.email))
        return res.json( { error: "Error email format" } );

    try {
        let user = await cAuth.reset(req.body);

        if (!user)
            return res.json( { error: "User with such email does not exist" } );

        res.json({
            message: "Successfully reset password. The link send to email."
        })

    } catch (error) {
        res.status(500).json( { error: "Server error: " + error } )
    }
});


/**
 * Recovery password router
 *
 * @example auth/recovery
 */
router.post('/recovery', recaptcha.middleware.verify, async (req, res, next) => {

    if (req.recaptcha.error)
        return res.json( { error: "ReCaptcha is not valid" } );

    if (!req.body.password || req.body.password === "")
        return res.json( { error: "Password field could not be empty" } );

    try {
        let userTokens = await cAuth.recovery(req.body);

        if (userTokens === "invalid-hash")
            return res.json( { error: "Invalid link. Please retry recovery password again." } );
        else if (userTokens === "blocked")
            return res.json( { message: "User was blocked, contact with administrator." } );
        else if (userTokens === "deleted")
            return res.json( { message: "User was deleted." } );
        else if (userTokens === "same-password")
            return res.json( { error: "New password could not be same with old password" } );

        res.json({
            message: "Successfully reset password",
            data: {
                access_token: userTokens.access_token,
                refresh_token: userTokens.refresh_token
            }
        })
    } catch (error) {
        res.status(500).json( { error: "Server error: " + error } )
    }
});


/**
 * Confirm email router
 *
 * @example auth/confirm
 */
router.get('/confirm', async (req, res, next) => {

    try {
        let userTokens = await cAuth.confirmEmail(req.query.hash);

        if (userTokens === "invalid-hash")
            res.json( { error: "Invalid link." } );
        else if (userTokens === "blocked")
            return res.json( { message: "User was blocked, contact with administrator." } );
        else if (userTokens === "deleted")
            return res.json( { message: "User was deleted." } );

        res.json({
            message: "Successfully confirm email",
            data: {
                access_token: userTokens.access_token,
                refresh_token: userTokens.refresh_token
            }
        });

    } catch (error) {
        res.status(500).json( { error: "Server error: " + error } )
    }
});


/**
 * Refresh tokens
 *
 * @example auth/refresh-token
 */
router.get('/refresh-token', async (req, res, next) => {

    try {
        let tokens = await cAuth.refreshTokens(req.headers);

        if (tokens === "no-token") {
            return res.status(400).json({
                error: "No refresh token in headers"
            })
        } else if (tokens === "error") {
            return res.status(400).json({
                error: "Refresh token is invalid"
            })
        } else if (tokens === "expired") {
            return res.status(401).json({
                error: "Refresh token is expired"
            })
        }
        res.json(tokens)
    } catch (error) {
        res.status(500).json( { error: "Server error: " + error } )
    }
});


module.exports = router;