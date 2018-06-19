const express   = require('express');
const router    = express.Router();

const getMarket = require('../modules/market');

/**
 * Get market data by website and type
 * type = all|be1|aprcy
 * @example market/:type/:site
 */
router.get('/:type/:site', async (req, res, next) => {
    let type = req.params.type,
        site = req.params.site;

    if (!(site || type)) {
        res.json({
            error: "Could not set `type` or `website`"
        })
    } else {

        let market = await getMarket(type, site);

        if (market === null) {
            res.json({
                error: "Not Found"
            })
        } else {
            res.json({
                message: "Market information successfully received",
                data: market
            })
        }
    }
});

module.exports = router;
