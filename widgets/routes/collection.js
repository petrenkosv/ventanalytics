'use strict';

const express   = require('express');
const router    = express.Router();
const { Op }    = require('sequelize');
const fs        = require('fs');
const path      = require("path");
const db        = require('../../web-server/models');
const handleUrl = process.env.ANALYTICS_SCRIPT_HOST + '/analytics/handle';


/**
 * Handle request from user script
 *
 * @example analytics/handle
 */
router.get('/handle', async (req, res, next) => { 
    // Получаем текущую дату
    let dt = new Date();
    let today = new Date(dt.getFullYear(),dt.getMonth(),dt.getDate());
    
    // Получаем URL'ы (полный и домен), с которого пришёл запрос
    let fullUrl = req.headers.referer || 'http://localhost/';
    let rootUrl = fullUrl.split('/')[2];
    
    // Проверяем, есть ли в БД такой сайт и запись сегодняшнего лога
    let currentLog = await db['sites'].findOne({
        where: { host: rootUrl },
        include: [{ model: db['visits_log'], as: 'visits_log', where: { date: today } }]
    });

    // Если есть, то инкрементируем значение уник. посещений в БД
    if (currentLog)
        await db['visits_log'].increment('visits_uniq', {
            where: { id: currentLog.visits_log[0].id }
        });

    // Посылаем ответ
    res.writeHead(200,{"Content-Type":"text/html"});
    res.end('');
});


/**
 * Get content from `script.js` for user, and user data for us
 *
 * @example analytics/script.js
 */
router.get('/script.js', async (req, res, next) => {
    // Генерируем уникальный ключ сессии
    let sessionKey = Math.random() * (1000 - 0) + 0;

    // Получаем текущую дату
    let dt = new Date();
    let today = new Date(dt.getFullYear(),dt.getMonth(),dt.getDate());
    
    // Получаем URL'ы (полный и домен), с которого пришёл запрос
    let fullUrl = req.headers.referer || 'http://localhost/';
    let rootUrl = fullUrl.split('/')[2];


    // Ищем запись с текущей датой
    let currentLog = await db['sites'].findOne({
        where: { host: rootUrl },
        include: [{ model: db['visits_log'], as: 'visits_log', where: { date: today } }]
    });

    if (currentLog) {
        // Инрементируем посещение
        await db['visits_log'].increment('visits_all', {
            where: { id: currentLog.visits_log[0].id }
        })
    } else {
        // Проверяем, есть ли сайт в БД
        let currentSite = await db['sites'].findOne({
            where: {
                host: rootUrl
            }
        });

        // Если сайт не найден, но добавляем его
        if (!currentSite) {
            currentSite = await db['sites'].create({
                host: rootUrl,
            });
        }
        
        // Добавляем новый лог
        let newElement = await db['visits_log'].create({
            site_id: currentSite.id,
            visits_all: 1,
            visits_uniq: 0,
            date: today
        });
    }

    // Возвращаем скрипт пользователю
    let jsText  = '',
        file    = path.join(__dirname, "..", "scripts", "analytics.js");

    if (fs.existsSync(file))
        jsText = fs.readFileSync(file);

    res.writeHead(200, {"Content-Type":"text/javascript"});
    res.end('let sessionKey = "' + sessionKey + '";\r\n'
        + 'let u = "' + handleUrl + '";\r\n'
        + jsText);

    // Завершаем, потому что дальнейший код СЕЙЧАС(!) не нужен
    return;

    // Получаем IP-адрес из headers
    let ip = (req.headers['x-forwarded-for'] || '').split(',').pop() || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress || 
         (req.connection.socket || '').remoteAddress;

    console.log('Session key: ', sessionKey);
    console.log('Headers: ', headers);
    console.log('IP address: ', ip);
});


module.exports = router;