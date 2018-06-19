'use strict';

const express     = require('express');
const router      = express.Router();
const cUser       = require('../controllers/user');
const cPermission = require('../controllers/permission');
const cAPIToken   = require('../controllers/apitoken');

/**
 * Get all users
 *
 * @requires permission ADMIN
 * @example user/admin/getAll
 */
router.get('/getAll', async (req, res, next) => {

    if (req.user.permissions.indexOf('ADMIN') === -1)
        return res.status(405).json({ error: "Method not allowed. You need admin permission."});

    try {
        res.json({
            message: "Users received successfully",
            data: await cUser.getAllUsers(req.query)
        });
    } catch (error) {
        res.status(500).json( { error: "Server error: " + error } )
    }
});

/**
 * Get user profile by ID
 *
 * @requires permission ADMIN
 * @example user/admin/get/:id
 */
router.get('/get/:id', async (req, res, next) => {

    if (req.user.permissions.indexOf('ADMIN') === -1)
        return res.status(405).json({ error: "Method not allowed. You need admin permission."});

    try {
        let user = await cUser.getUser(req.params.id);

        if (!user)
            return res.json( { error: "User not found" } );

        res.json({
            message: "Profile was received successfully",
            data: user
        });

    } catch (error) {
        res.status(500).json( { error: "Server error: " + error } )
    }

});


/**
 * Block user profile
 *
 * @requires permission ADMIN
 * @example user/admin/block/:id
 */
router.put('/block/:id', async (req, res, next) => {

    if (req.user.permissions.indexOf('ADMIN') === -1)
        return res.status(405).json({ error: "Method not allowed. You need admin permission."});

    try {
        let user = await cUser.blockUser(req.params.id);

        if (!user)
            return res.json( { error: "User not found" } );

        res.json({
            message: "User was blocked successfully",
            data: user
        });
    } catch (error) {
        res.status(500).json( { error: "Server error: " + error } )
    }
});


/**
 * Unblock user profile
 *
 * @requires permission ADMIN
 * @example user/admin/unblock/:id
 */
router.put('/unblock/:id', async (req, res, next) => {

    if (req.user.permissions.indexOf('ADMIN') === -1)
        return res.status(405).json({ error: "Method not allowed. You need admin permission."});

    try {
        let user = await cUser.unBlockUser(req.params.id);

        if (!user)
            return res.json( { error: "User not found" } );

        res.json({
            message: "User was unblocked successfully",
            data: user
        });
    } catch (error) {
        res.status(500).json( { error: "Server error: " + error } )
    }
});


/**
 * Add permission to user
 *
 * @requires permission ADMIN
 * @example user/admin/permission
 */
router.post('/permission', async (req, res, next) => {

    if (req.user.permissions.indexOf('ADMIN') === -1)
        return res.status(405).json({ error: "Method not allowed. You need admin permission."});

    try {
        let permission = await cPermission.addPermission(req.body);

        if (!permission)
            return res.json( { error: "User not found" } );

        res.json({
            message: "Permission was added successfully",
            data: permission
        });
    } catch (error) {
        res.status(500).json( { error: "Server error: " + error } )
    }
});


/**
 * Delete permission by ID
 *
 * @requires permission ADMIN
 * @example user/admin/permission/:id
 */
router.delete('/permission/:id', async (req, res, next) => {

    if (req.user.permissions.indexOf('ADMIN') === -1)
        return res.status(405).json({ error: "Method not allowed. You need admin permission."});

    try {
        let permission = await cPermission.removePermission(req.params.id);

        if (!permission)
            return res.json( { error: "Permission not found" } );

        res.json({
            message: "Permission was removed successfully"
        });
    } catch (error) {
        res.status(500).json( { error: "Server error: " + error } )
    }
});


/**
 * Unblock user profile
 *
 * @requires permission ADMIN
 * @example user/admin/apitoken/:id
 */
router.put('/apitoken/:id', async (req, res, next) => {

    if (req.user.permissions.indexOf('ADMIN') === -1)
        return res.status(405).json({ error: "Method not allowed. You need admin permission."});

    try {
        let token = await cAPIToken.update(req.params.id, req.body);

        if (!token)
            return res.json( { error: "Token does not found" } );

        res.json({
            message: "API token was updated successfully",
            data: token
        });
    } catch (error) {
        res.status(500).json( { error: "Server error: " + error } )
    }
});

module.exports = router;