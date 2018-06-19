'use strict';

const express   = require('express');
const router    = express.Router();
const cUser     = require('../controllers/user');
const cAPIToken = require('../controllers/apitoken');


/**
 * Get profile
 *
 * @example /user
 */
router.get('/', async (req, res, next) => {
    try {
        let user = await cUser.getUser(req.user.id);

        if (!user)
            return res.status(401).json( { error: "User not found" } );

        res.json({
            message: "Profile was received successfully",
            data: user
        });

    } catch (error) {
        res.status(500).json( { error: "Server error: " + error } )
    }
});

/**
 * Update profile
 *
 * @example /user/:id
 */
router.put('/:id', async (req, res, next) => {
    let userID = req.params.id;

    if (!(userID === req.user.id || req.user.permissions.indexOf('ADMIN') !== -1))
        return res.status(405).json({ error: "Method not allowed. You need admin permission."});

    try {
        let user = await cUser.updateUser(userID, req.body);

        if (!user)
            return res.status(401).json( { error: "User not found" } );
        else if (user === "Nothing changes")
            return res.json( { message: "Nothing changes" } );

        res.json({
            message: "Profile was updated successfully",
            data: user
        });
    } catch (error) {
        res.status(500).json( { error: "Server error: " + error } )
    }
});

/**
 * Delete profile
 *
 * @example /user
 */
router.delete('/', async (req, res, next) => {

    try {
        let user = await cUser.deleteUser(req.user.id);

        if (!user)
            return res.status(401).json( { error: "User not found" } );

        res.json({
            message: "Profile was deleted successfully"
        })

    } catch (error) {
        res.status(500).json( { error: "Server error: " + error } )
    }
});

/**
 * Update user password
 *
 * @example /user/:id/changePassword
 */
router.put('/:id/changePassword', async (req, res, next) => {
    let userID = req.params.id;

    if (!(userID === req.user.id || req.user.permissions.indexOf('ADMIN') !== -1))
        return res.status(405).json({ error: "Method not allowed. You need admin permission."});

    try {
        let user = await cUser.changePassword(userID, req.body);

        if (!user)
            return res.status(401).json( { error: "User not found" } );
        else if (user === 'same')
            return res.json( { message: "New password could not be same with old password" } );

        res.json({
            message: "Password was changed successfully"
        });

    } catch (error) {
        res.status(500).json( { error: "Server error: " + error } )
    }
});


/**
 * Create API token
 *
 * @example /user/api-token/create
 */
router.get('/api-token/create', async (req, res, next) => {

    try {
        let token = await cAPIToken.create(req.user.id);

        if (!token)
            return res.json( { error: "User not found" } );
        else if (token.error)
            return res.json( token.error );

        res.json({
            message: "Successfully created token API",
            data: token
        })
    } catch (error) {
        res.status(500).json( { error: "Server error: " + error } )
    }
});


/**
 * API token history
 *
 * @example /user/:id/api-token/:hash/history
 */
router.get('/:id/api-token/:hash/history', async (req, res, next) => {

    let user = req.params.id !== 'undefined' ? req.params.id : req.user.id;

    try {
        let history = await cAPIToken.getHistory(user, req.params.hash, req.query);

        if (!history)
            return res.json( { error: "Token does not found" } );

        res.json({
            message: "Successfully retrieve token history data",
            data: history
        })
    } catch (error) {
        res.status(500).json( { error: "Server error: " + error } )
    }
});


module.exports = router;