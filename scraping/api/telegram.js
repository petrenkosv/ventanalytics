'use strict';

const telegram = require('telegram-bot-api');

const apiForSend = new telegram({
    token: process.env.TELEGRAM_TOKEN
});


/**
 * Send message to chat
 *
 * @param chat_id {Number}
 * @param message {String}
 * @private
 */
let sendMessage_ = (chat_id, message) => {
    apiForSend.sendMessage({
        chat_id: chat_id,
        text: message
    })
};


const telegramTokens =  process.env.TELEGRAM_SCRAPING_TOKENS.split(' ');
const perBotRequestLimit = 180;
let tokenIndex = 0;
let apiInstance = false;
let requestCount = 0;
let retry = 0;


let getApiInstance = () => {
    if(requestCount >= perBotRequestLimit ){
        requestCount = 0;
        return apiInstance = newApiInstance();
    }
    if(!apiInstance) apiInstance = newApiInstance();
    return apiInstance;
};


let newApiInstance = () => {
    let token =  telegramTokens[tokenIndex];
    let instance = new telegram({
        token: token
    });
    tokenIndex ++;
    if(telegramTokens[tokenIndex] == null){
        tokenIndex = 0;
    }
    return instance;
};


/**
 * Get telegram members based on chat_id
 *
 * @param chat_id - `@chanelusername`
 * @returns {Promise}
 * @private
 */
let getChatMembersCount_ = function (chat_id) {
    requestCount++;

    if (chat_id === "" || chat_id === null || chat_id === undefined)
        return -1;

    chat_id = chat_id.replace(/\//g, '')
        .replace(/https:t.me/i, '')
        .replace(/https:telegram.me/i, '')
        .replace(/https:www.t.me/i, '')
        .replace(/https:www.telegram.me/i, '')
        .replace(/http:t.me/i, '')
        .replace(/http:telegram.me/i, '')
        .replace(/http:www.t.me/i, '')
        .replace(/http:www.telegram.me/i, '')
        .replace(/joinchat/i, '')
        .replace(/@/g, '');

    return getApiInstance().getChatMembersCount({
        chat_id: '@' + chat_id
    }).then(data => {
        retry = 0;
        return data;
    }).catch(err => {
        if(err.statusCode === 429){
            if(retry < 2){
                apiInstance = false;
                getChatMembersCount_(chat_id);
            }else{
                retry = 0;
                return -2;
            }
            retry ++;
        } else {
            return -2;
        }
    })
};


module.exports = {
    sendMessage: sendMessage_,
    getChatMembersCount: getChatMembersCount_,
};