'use strict';

const logger        = require('../../modules/logger')('scraping');
const ObjectID      = require('mongodb').ObjectID;
const MongoClient   = require('mongodb').MongoClient;

let collection = null;

let uploader    = {},  // object with `ico` objects for uploading
    processing  = {};  // show is ico processing or not

const mongoSettings = {
    reconnectTries : 10,
    autoReconnect : true
};


/**
 * Compare values based on their typeof and value
 * @param tmpValue - current value
 * @param value - new value
 * @returns modify tmpValue
 * @private
 */
let compareValues_ = (tmpValue, value) => {
    switch(typeof value) {
        case "string":
            tmpValue = ((tmpValue !== value || tmpValue === "" || tmpValue === undefined) && !(value === "" || value === undefined)) ? value : tmpValue;
            break;
        case "number":
            tmpValue = ((tmpValue !== value || tmpValue === -1 || tmpValue === undefined) && !(value === -1 || value === undefined)) ? value : tmpValue;
            break;
        case "boolean":
            tmpValue = value;
            break;
    }
    return tmpValue;
};


/**
 * Update ico in DB
 * @param object - `icoClass`
 * @returns {Promise}
 */
let updateICO = (object) => {

    return collection.findOne({ website: object.website })
        .then(ico => {
            if (!ico) {

                // insert new ICO
                return collection.insertOne(object.toJSON())
                    .catch(error => {
                        logger.error("Uploader icos error in `collection.insertOne`. " + error)
                    });

            } else {

                // update ICO
                if (object['resources'][0] !== null) {
                    for (let key in object) {

                        if (key === "resources") {
                            if (ico[key].indexOf(object[key][0]) === -1) {
                                ico[key].push(object[key][0]);
                            }
                        }
                        else if (key === "dates") {
                            ico[key]['icoStart']    =  (ico[key]['icoStart'] === null) ? object[key]['icoStart'] : ico[key]['icoStart'];
                            ico[key]['icoEnd']      =  (ico[key]['icoEnd'] === null) ? object[key]['icoEnd'] : ico[key]['icoEnd'];
                            ico[key]['preIcoStart'] =  (ico[key]['preIcoStart'] === null) ? object[key]['preIcoStart'] : ico[key]['preIcoStart'];
                            ico[key]['preIcoEnd']   =  (ico[key]['preIcoEnd'] === null) ? object[key]['preIcoEnd'] : ico[key]['preIcoEnd'];
                            ico[key]['durationPreIco'] = (ico[key]['durationPreIco'] === -1) ? ((object.dates.preIcoStart === null || object.dates.preIcoEnd === null) ? -1 : ((+new Date(object.dates.preIcoEnd) - +new Date(object.dates.preIcoStart))/(1000*60*60*24*7)).toFixed(1)) : ico[key]['durationPreIco'];
                            ico[key]['durationIco']    = (ico[key]['durationIco'] === -1) ? ((object.dates.icoStart === null || object.dates.icoEnd === null) ? -1 : ((+new Date(object.dates.icoEnd) - +new Date(object.dates.icoStart))/(1000*60*60*24*7)).toFixed(1)) : ico[key]['durationIco'];
                        }
                        else if (key === "timestamp") {
                            ico[key] = object[key];
                        }
                        else if (key === "milestones" || key === "distribution" || key === "additionalLinks" || key === "screenShorts") {
                            if (ico[key].length === 0) {
                                ico[key] = object[key];
                            }
                        }
                        else if (typeof object[key] === "object" && object[key] !== null && key !== "_id") {

                            for (let key1 in object[key]) {
                                if (ico[key] === undefined) {
                                    ico[key] = {};
                                }
                                if (typeof object[key][key1] === "number" || typeof object[key][key1] === "string" || typeof object[key][key1] === "boolean") {
                                    ico[key][key1] = compareValues_(ico[key][key1], object[key][key1]);
                                }
                                else if (key === "finance" && (key1 === "totalMoney" || key1 === "hardcap")) {
                                    if (parseInt(ico[key][key1]) < parseInt(object[key][key1])) {
                                        ico[key][key1] = object[key][key1];
                                    }
                                }
                                else if (typeof object[key][key1] === "object" && object[key][key1] !== null) {

                                    for (let key2 in object[key][key1]) {
                                        if (ico[key][key1] === undefined) {
                                            ico[key][key1] = {};
                                        }
                                        if (typeof object[key][key1][key2] === "number" || typeof object[key][key1][key2] === "string" || typeof object[key][key1][key2] === "boolean") {
                                            ico[key][key1][key2] = compareValues_(ico[key][key1][key2], object[key][key1][key2]);
                                        }
                                    }

                                }
                            }
                        }
                    }
                }

                return collection.update({_id: ObjectID(ico._id)}, ico)
                    .catch(error => {
                        logger.error("Uploader icos error in `collection.updateOne`. " + error)
                    });

            }

        })
        .catch(error => {
            logger.error("Uploader icos error in `collection.findOne`. " + error)
        });
};

/**
 * Check if ico updating and update if not
 * @param website
 */
let preUpload = (website) => {

    if (processing[website]) {
        return;
    }
    processing[website] = true;

    let update = () => {

        updateICO(uploader[website].shift())
            .then(() => {
                if (uploader[website].length){
                    update();
                } else {
                    processing[website] = false;
                }
            })

    };

    update();
};

/**
 * Add new ico to the preUpload function
 * @param object - `icoClass`
 * @private
 */
let add_ = (object) => {
    if (!uploader[object.website]) {
        uploader[object.website] = [];
    }

    uploader[object.website].push(object);

    preUpload(object.website);

};

/**
 * Return status of DB connection
 * @returns {boolean}
 * @private
 */
let isConnected_ = () => {
    return collection !== null;
};


/**
 * Connect to mongoClient
 * @returns {Promise}
 * @private
 */
let connect_ = () => {
    return MongoClient.connect(process.env.DB_MONGO_URI, mongoSettings)
        .then(cl => {

            collection = cl.db(process.env.DB_SCRAPING_TABLE).collection(process.env.DB_SCRAPING_COLLECTION);

            if (process.env.NODE_ENV === "development")
                logger.info("ICOs uploader connect");

            return true;
        })
        .catch(error => {
            logger.error("Could not connect to MongoDB. " + error);
            return false;
        })
};

let getCollection = () => {
    return collection;
};

let init_ = async () => {
    return await connect_()
};

module.exports = {
    init: init_,
    connect: connect_,
    isConnected: isConnected_,
    collection: getCollection,
    add: add_
};