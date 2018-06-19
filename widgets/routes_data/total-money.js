'use strict';

const express   = require('express');
const router    = express.Router();
const ICO   = require('../../scraping/models/ICO');

let getDateByWeek = (week, opt) => {
    let curr = null;
    switch (week) {
        case "current": curr = new Date(); break;
        case "prev": curr = new Date( +new Date() - 7*24*60*60*1000); break;
        case "next": curr = new Date( +new Date() + 7*24*60*60*1000); break;
    }

    if (!curr) return null;

    let first = curr.getDate() - curr.getDay(),
        last = first + 6,
        date = null;

    switch (opt) {
        case "start": date = new Date(curr.setDate(first)); break;
        case "end":  date = new Date(curr.setDate(last)); break;
    }

    if (!date) return null;

    return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
};

router.get('/', async (req, res, next) => {

    let query = {
        icodateend: "{\"from\":\"" + getDateByWeek("prev", "start") + "\", \"until\":\"" + getDateByWeek("prev", "end") + "\"}",
        fields: "name|finance.totalMoney|dates.icoEnd",
        limit: 1000
    };

    ICO.getByQuery(query)
        .then(icos => {
            res.json({
                message: "Success getting icos",
                data: icos
            })
        })
        .catch(error => {
            res.json({
                error: error
            })
        });

});

module.exports = router;