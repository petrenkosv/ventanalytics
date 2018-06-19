'use strict';

const Telegram  = require('../scraping/api/telegram');
const winston   = require('winston');
const config    = winston.config;

module.exports = (moduleName) => {

    let filePrefix = (new Date().getMonth() + 1) + "-" + new Date().getFullYear() + "-" + moduleName,
        addZero_ = (i) => { return i < 10 ? ("0" + i) : i; },
        getDateString_ = (date) => { return "[" + addZero_(date.getDate()) + "." + addZero_(date.getMonth()+1) + "." + (date.getYear()-100) + " " + addZero_(date.getHours()) + ":" + addZero_(date.getMinutes()) + ":" + addZero_(date.getSeconds()) + "]"; };

    let logger = new winston.Logger({
        transports : [
            new winston.transports.File({
                level   : 'error',
                filename: process.cwd() + '/logs/' + filePrefix + '-errors.log',
                json    : true,
                maxSize : 10485760, // 10mb
            }),
            new winston.transports.Console({
                colorize    : true,
                json        : false,
                stringify   : false,
                timestamp: () => {
                    return getDateString_(new Date());
                },
                formatter: (options) => {
                    return options.timestamp() + ' ' + config.colorize(options.level, options.level.toUpperCase()) + ' ' + (options.message ? options.message : '');
                }
            })
        ],
        exitOnError: false
    });

    logger.on('logging', (transport, level, msg, meta) => {
        if (level === "error" && process.env.NODE_ENV === "production")
            Telegram.sendMessage(process.env.TELEGRAM_ERRORS_CHAT_ID, getDateString_(new Date()) + "\n" + msg);

        if (level === "info" && meta.module === "admin-info" && process.env.NODE_ENV === "production")
            Telegram.sendMessage(process.env.TELEGRAM_ADMIN_INFO_CHAT_ID, getDateString_(new Date()) + "\n" + msg);
    });

    return logger;

};

