'use strict';

const axios  = require('axios');


/**
 * Count follows and posts in medium
 *
 * @param pageName {String}
 * @returns {Object}
 * @private
 */
module.exports = (pageName) => {
    if (pageName === "" || pageName === null || pageName === undefined)
        return {error: "Medium: page name is not set `" + pageName + "`"};

    if (pageName.search(/@/) === -1)
        pageName = "@" + pageName;

    let url = 'https://medium.com/' + pageName + '/?format=json';

    return axios.get(url)
        .then(response => {
            let data = JSON.parse(response.data.substring(response.data.search('{'), response.data.length)),
                userId = data.payload.user.userId,
                follows = null,
                posts = null;

            if (data.payload.userMeta.userId === userId)
                posts = parseInt(data.payload.userMeta.numberOfPostsPublished);

            if (data['payload']['references']['SocialStats'][userId] !== undefined)
                follows = parseInt(data['payload']['references']['SocialStats'][userId]['usersFollowedByCount']);

            return {
                follows: follows,
                posts: posts
            };
        })
        .catch(error => {
            return {error: "Medium: error occur on getting data from : `" + url + "`. " + error};
        });
};

