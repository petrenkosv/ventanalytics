const express   = require('express');
const router    = express.Router();

const db    = require('../../web-server/models');

const AVAILABLE_MODES = ['day','week','month','quarter','year'];
const LIMITS = { day: 288, week: 672, month: 31, quarter: 93, year: 365};

/**
 * Get token-indexes for charts by query
 */
router.get('/', async (req, res, next) => {

    let mode = req.query.mode ? req.query.mode : 'day',
        where = {};

    if (AVAILABLE_MODES.indexOf(mode) === -1) {
        return res.json({
            error: "Unavailable `mode` for token-index"
        })
    }

    where['mode_'+mode] = true;
    
    db['token-indexes'].findAll({
            where: where,
			order: [['label', 'DESC']],
            limit: LIMITS[mode]
        })
        .then(indexes => {
            
            const results = indexes.map(index => {

                return Object.assign(
                    {},
                    {
                        value: index.getDataValue('value'),
                        label: index.getDataValue('label'),
                    }
                );
            });
	
            res.json({
                message: "Success getting token-indexes",
                data: results
            })
        })
        .catch(error => {
            res.json({
                error: "Could not get token-indexes. " + error
            })
        });
});

module.exports = router;