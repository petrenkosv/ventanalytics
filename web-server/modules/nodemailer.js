'use strict';

const nodemailer = require('nodemailer');

module.exports = nodemailer.createTransport({
    // host: 'smtp.ethereal.email',
    // port: 587,
    service: "Yandex",
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.NODEMAILER_EMAIL,     // generated ethereal user
        pass: process.env.NODEMAILER_PASSWORD   // generated ethereal password
    }
});