'use strict';

const util       = require('util');
const Strategy   = require('passport-strategy').Strategy;
const authModule = require('./auth');


/**
 * Strategy constructor
 *
 * @param options {Object}
 */
function APIStrategy(options) {
    Strategy.call(this);
    this.name = options.name || 'api-jwt';
    this._tokenParam = options.tokenParam;

    if (!this._tokenParam) {
        throw new Error("AuthStrategy requires a tokenParam")
    }
}

util.inherits(APIStrategy, Strategy);


/**
 * Authenticate request
 */
APIStrategy.prototype.authenticate = async function (req, options)  {
    let self = this;

    let token = null;

    // api token AUTH
    if (req.query[self._tokenParam])
    {
        token = authModule.checkAPIFormat(req.query[self._tokenParam]);
        if (!token)
            return self.fail("Wrong API token format", 400);

        let result = await authModule.checkAPIToken(token);
        if (result === "not-found")
            return self.fail("Token does not found", 400);
        else if (result === "not-active")
            return self.fail("Token is blocked", 402);
        else if (result === "requests-limits")
            return self.fail("Request limits", 402);
        else if (result === "valid-date-error")
            return self.fail("Subscribe complete", 402);
        else
            // token = user_id
            return self.success({ id: result })
    }
    return self.fail("No auth token", 400)
};


/**
 * Export the Strategy
 */
module.exports = APIStrategy;