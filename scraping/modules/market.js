module.exports = async (type, website) => {

    if (website === undefined || website === null || website === "") {
        return null;
    }

    if (website.search(/:\/\//) !== -1) website = website.split('://')[1];
    if (website.search(/\//) !== -1) website = website.split('/')[0];
    if (website.search(/\?/) !== -1) website = website.split('?')[0];
    if (website.split(/./).length > 2) website = website.split('.')[website.split('.').length - 2] + "." + website.split('.')[website.split('.').length - 1];

    switch (type) {
        case 'be1':
            return await require('../functions/be1')(website);
        case 'aprcy':
            return await require('../functions/aprcy')(website);
        default:
            return {
                be1: await require('../functions/be1')(website),
                aprcy: await require('../functions/aprcy')(website)
            }
    }

};