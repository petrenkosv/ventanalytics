const express = require('express');
const router  = express.Router();

const getGithub = require('../modules/github');

/**
 * Get github by organization
 * @example github/:organization
 */
router.get('/:org', async (req, res, next) => {

    let github = await getGithub(req.params.org);

    if (github === null) {
        res.json({
            error: "Not Found"
        })
    } else {
        res.json({
            message: "Information successfully received from github",
            data: github
        })
    }
});

module.exports = router;
