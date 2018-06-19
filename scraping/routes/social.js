const express   = require('express');
const router    = express.Router();

const getSocial = require('../modules/social');

/**
 * Get social data by query
 */
router.get('/', async (req, res, next) => {
    if (Object.keys(req.query).length === 0) {
        res.json({
            error: "Not valid query. Attribute of social network is required."
        })
    } else {
        getSocial(req.query)
            .then(social => {
                res.json({
                    message: "Social data successfully received",
                    data: social
                })
            })
            .catch(error => {
                res.json({
                    error: error
                })
            });
    }
});

module.exports = router;