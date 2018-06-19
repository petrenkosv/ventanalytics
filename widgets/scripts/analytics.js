'use strict';

let init = function () {

    let cacheSessionId = getSessionKey(sessionKey);

    function refreshSessionKey() {
        localStorage['sessionId'] = sessionKey;
        localStorage['expDate'] = (addDays(new Date(), 1)).toLocaleDateString().split('.').reverse().join('.');
        httpGet(u);
    }

    function addDays(date, days) {
        let result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    function getSessionKey(sessionKey) {
        if (localStorage['sessionId'] && localStorage['expDate']) {
            let mydt = Date.parse(localStorage['expDate']);
            let curdt = (new Date()).getTime();
            if (curdt >= mydt)
                refreshSessionKey();
        } else {
            refreshSessionKey();
        }

        return localStorage['sessionId'];
    }

    function httpGet(u)
    {
        let x = new XMLHttpRequest();
        x.open('GET', u, false);
        x.send(null);
    }

    function getData() {
        return {
            navigator: navigator,
            screen: screen,
            timezone: -new Date().getTimezoneOffset()/60,
            ssid: cacheSessionId,
            platform: navigator.platform,
        };
    }

}();