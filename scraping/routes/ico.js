'use strict';

const express   = require('express');
const router    = express.Router();

const ICO   = require('../models/ICO');

/**
 * GET ICOs by query
 */
router.get('/query', (req, res, next) => {
    if (!req.query.fields) {
        res.json({
            error: "Not valid query. Set `fields=` is required."
        })
    } else {
        ICO.getByQuery(req.query)
            .then(icos => {
                res.json({
                        message: "Successfully getting ICOs",
                    data: icos
                })
            })
            .catch(error => {
                res.json({
                    error: error
                })
            });
    }
});


/**
 * GET ICO by ID
 */
router.get('/:id', (req, res, next) => {
    let id = req.params.id;
    if (id.length !== 24) {
        res.json({
            error: "Error occurred: not valid ID"
        })
    } else {
        ICO.getById(id)
            .then(ico => {
                res.json({
                    message: "Successfully getting ICO",
                    data: ico
                })
            })
            .catch(error => {
                res.json({
                    error: error
                })
            });
    }
});


/**
 * Create new ICO
 */
router.post('/', (req, res, next) => {

    if (req.user.permissions.indexOf('SCRAPING') === -1)
        return res.status(405).json({ error: "Method not allowed. You need scraping permission."});

    ICO.create(req.body)
        .then(ico => {
            res.json({
                message: "ICO created successfully.",
                data: ico
            })
        })
        .catch(error => {
            res.json({
                error: error
            })
        });
});

/**
 * Update ICO
 */
router.put('/:id', (req, res, next) => {

    if (req.user.permissions.indexOf('SCRAPING') === -1)
        return res.status(405).json({ error: "Method not allowed. You need scraping permission."});

    ICO.update(req.body)
        .then(ico => {
            res.json({
                message: "ICO updated successfully.",
                data: ico
            })
        })
        .catch(error => {
            res.json({
                error: error
            })
        });
});

module.exports = router;