'use strict';

const express   = require('express');
const router    = express.Router();

const { Op } = require('sequelize');
const db    = require('../../web-server/models');


let getDate = (date) => {
    return new Date(date.getFullYear() + '-' + (date.getMonth() + 1 ) + '-' + date.getDate());
};


router.get('/', async (req, res, next) => {

    let curDate = +getDate(new Date());

    let sites = await db['sites'].findAll({
        where: {
            host: {
                [Op.notLike]: '%localhost%'
            }
        },
        include: [{ model: db['visits_log'], as: 'visits_log', where: {
            date : {
                [Op.gte]: curDate - 5*24*60*60*1000
            }
        }}]
    });
    
    let result = [];

    let dates = [
        getDate(new Date(curDate -   24*60*60*1000)).toISOString(),
        getDate(new Date(curDate - 2*24*60*60*1000)).toISOString(),
        getDate(new Date(curDate - 3*24*60*60*1000)).toISOString(),
        getDate(new Date(curDate - 4*24*60*60*1000)).toISOString(),
        getDate(new Date(curDate - 5*24*60*60*1000)).toISOString() 
    ];

    let site = null,
        visits = null,
        date = null;
        
    for (let i in sites) {
        site = sites[i].toJSON();

        // Формируем новый объект
        let res = {
            host: site.host
        }
        res[dates[0]] = 0;
        res[dates[1]] = 0;
        res[dates[2]] = 0;
        res[dates[3]] = 0;
        res[dates[4]] = 0;
        result.push(res);
        
        for (let j in site['visits_log']) {
            visits = site['visits_log'][j].toJSON();
            switch(+getDate(new Date(visits.date))) {
                case curDate - 24*60*60*1000:
                    res[dates[0]] = visits.visits_uniq; break;
                case curDate - 2*24*60*60*1000:
                    res[dates[1]] = visits.visits_uniq; break;
                case curDate - 3*24*60*60*1000:
                    res[dates[2]] = visits.visits_uniq; break;
                case curDate - 4*24*60*60*1000:
                    res[dates[3]] = visits.visits_uniq; break;
                case curDate - 5*24*60*60*1000:
                    res[dates[4]] = visits.visits_uniq; break;
            }
        }
    }

    res.json({
        message: "Success getting data",
        data: result
    })
});

module.exports = router;