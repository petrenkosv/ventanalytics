'use strict';

const express   = require('express');
const router    = express.Router();
const Redis     = require('redis');

let getData_ = (redisClient) => {
    return new Promise(resolve => {
        redisClient.hgetall(process.env.REDIS_DATABASE + ":listing-chart" , (err, data) => {
            if (err || data === null) {
                resolve({ next: [], current: [] });
            } else {
                resolve({ next: JSON.parse(data.next), current: JSON.parse(data.current) });
            }
        })
    })
};

router.get('/', async (req, res, next) => {

    let redisClient = await Redis.createClient();

    if (process.env.REDIS_PASSWORD !== "")
        await redisClient.auth(process.env.REDIS_PASSWORD);

    let data = await getData_(redisClient);

    redisClient.quit();

    res.json({
        message: "Success getting data",
        data: data
    })
});

module.exports = router;