const MongoClient   = require('mongodb').MongoClient;
const ObjectID      = require('mongodb').ObjectID;

const IsJsonString = (str) => { try { JSON.parse(str); } catch (e) { return false; } return true; };

const categories = { // else: ""
    "Blockchain service": ["Blockchain Service","Blockchain","Smart Contract","Masternode","Platform","Blockchain Infrastructure"],
    "Crypto"            : ["Mining","Crowdfunding","CryptoFund","Token Discounter","Cryptocurrency","Crowdfunding & Lending"],
    "Energy"            : ["Energy","Energy & Utilities"],
    "Finance"           : ["Finance","Exchange","Currency","Banking","Payments","Business","Card","Market","Marketplace","Business services","Entertainment","Investment","Exchanges & Wallets","Financial Services","Commerce & Retail","Business Services & Consulting","Banking & Payments","Retail"],
    "Game and VR"       : ["VR", "Gaming", "Gaming & VR","Virtual Reality"],
    "High tech"         : ["Hybrid Intellingence","Cloud Storage","Artificial Intelligence","IOT","Data Service","Hi-Tech","Big Data","Electronics","IT","Internet & Telecommunications","Computing & Data Storage","Software"],
    "Insurance"         : ["Insurance"],
    "Marketing"         : ["Marketing","Advertising","Media","Social Network","Collaboration","Network","Social", "Communication","Marketing & Advertising","Social Media & Communication"],
    "Security"          : ["Security","Verification","Privacy & Security","Identity & Reputation"],
    "Trading"           : ["Trading","Ticketing","Bets","Gambling","Casino & Gambling","Gambling & Betting","Asset Management"]
};

const regions = {
    "Asia"              : ["China","Cambodia","Kazakhstan","Kyrgyzstan","Hong Kong","India","Japan","Malaysia","Pakistan","Philippines","United Arab Emirates","Vietnam","Thailand","South Korea","Singapore","Indonesia","Taiwan"],
    "Africa"            : ["Guinea-Bissau","Kenya","Nigeria","Tanzania","South Africa","Sierra Leone","Seychelles","Mauritius"],
    "Near East"         : ["Armenia","Dubai","Georgia","Israel","Turkey"],
    "Caribbean islands" : ["British Virgin Islands","Cayman Islands","Dominican Republic","Saint Lucia","Virgin Islands","Curacao","Turks and Caicos Islands"],
    "Oceania"           : ["Australia","Marshall Islands","New Zealand","Vanuatu"],
    "North America"     : ["Canada","USA","UNITED STATE","United States","Mexico"],
    "South America"     : ["Argentina","Brazil","Chile","Colombia"],
    "Central America"   : ["Costa Rica","Belize","Guatemala","Panama"],
    "West Europe"       : ["Austria","Belgium","Denmark","France","United Kingdom","Germany","Switzerland","The Netherlands","Monaco","Netherlands","London","Luxembourg","Italy","Spain","Portugal","Ireland","Liechtenstein","Malta","UK","Andorra","Cyprus","Gibraltar","Greece","Isle of Man","Jersey"],
    "East Europe"       : ["Belarus","Czech Republic","Estonia","Finland","Slovakia","Slovenia","Slovenija","Latvia","Lithuania","Sweden","Poland","Moldova","Norway","Romania","Russia","Serbia","Ukraine","UK, Poland","Bulgaria","Croatia","Hungary"],
    "World"             : ["Worldwide"]
};


const mongoSettings = {
    reconnectTries : 10,
    autoReconnect : true
};


class icoClass {
    constructor() {
        this.name       = ""; // Name
        this.website    = "";
        this.resources  = [];
        this.maininfo   = {
            description : "", // Расширенное описание компании: (icoDrops ||icoRating)
            intro       : "", // О проекте (icoBench)
            about       : "", // О проекте (icoBench)
            country     : "",
            region      : "",
            company     : ""
        };
        this.finance = {
            token       : "", // Ticker symbol
            category    : "", // ICO type
            tokenType   : "", // Тип токена
            totalTokens : -1, // Общее количество токенов
            saleTokens  : -1, // Доступно в токенов в продаже
            salePercent : -1, // Токенов будет выпущено для продажи, %
            price       : -1, // Цена 1 токена в USD
            accepting   : "", // Принимаются к платежам
            tokensRole  : "", // Роль токенов
            dividends   : "", // Дивиденды
            emission    : "", // Дополнительная эмиссия токенов
            escrow      : "", // Escrow
            totalMoney  : -1, // Всего собрано денег
            hardcap     : -1, // Максимально планируется собрать
            softcap     : -1, // Минимально планируется собрать
            distributed : -1, //
            bonus       : false,// Бонусы
            platform    : ""
        };
        this.dates = {
            preIcoStart     : null,
            preIcoEnd       : null,
            icoStart        : null,
            icoEnd          : null,
            durationIco     : -1, // Продолжительность продажи токенов в ICO (недели)
            durationPreIco  : -1, // Продолжительность продажи токенов в preICO (недели)
        };
        this.team = {
            members : [],
            from    : "",
            size    : -1,
        };
        this.links = {
            whitepaper  : "",
            twitter     : "",
            telegram    : "",
            medium      : "",
            slack       : "",
            reddit      : "",
            linkedin    : "",
            facebook    : "",
            github      : "",
            crunchbase  : "",
            bitcointalk : "",
            youtube     : ""
        };
        this.features = {
            content : "",
            techDetails : "",
        };
        this.bounty = {
            link    : "", // Ссылка на Bounty
            shamea  : ""  // Схема распределения % по программе
        };
        this.wallets = {
            btc     : "",
            eth     : ""
        };
        this.milestones      = [];
        this.distribution    = ""; // Схема распределения токенов и капитала
        this.additionalLinks = {};
        this.screenShorts    = {};
        this.rating = {
            icodrops : {
                totalrate   : "",
                hyperate    : "",
                riskrate    : "",
                roirate     : ""
            },
            icobench : {
                total       : "",
                profile     : "",
                team        : "",
                vision      : "",
                product     : ""
            },
            icobazaar : {
                total       : "",
                site        : "",
                team        : "",
                idea        : "",
                media       : "",
                technology  : ""
            },
            icorating : {
                investment  : "",
                hypescore   : "",
                riskscore   : ""
            },
            ventanalytics: {
                p_hardcap: -1
            }
        };
        this.timestamp = new Date();
    }

    toJSON() {
        return {
            name: this.name.toLowerCase(),
            website: this.website,
            resources: this.resources,
            maininfo: this.maininfo,
            finance: this.finance,
            dates: this.dates,
            team: this.team,
            links: this.links,
            features: this.features,
            bounty: this.bounty,
            milestones: this.milestones,
            distribution: this.distribution,
            additionalLinks: this.additionalLinks,
            screenShorts: this.screenShorts,
            rating: this.rating,
            timestamp: this.timestamp
        }
    }

    set(fields, value) {
        if (value === "" || value === undefined || typeof value === "undefined") {
            value = (typeof value === "number") ? -1 : "";
        }
        switch (fields.length) {
            case 1: this[fields[0]] = value; break;
            case 2: this[fields[0]][fields[1]] = value; break;
            case 3: this[fields[0]][fields[1]][fields[2]] = value; break;
            case 4: this[fields[0]][fields[1]][fields[2]][fields[3]] = value; break;
        }
    }

    setWebsite(string) {
        if (string === undefined || string === null || string.split('://').length === 1) {
            this.website = undefined;
            return;
        }

        let protocol = string.split('://')[0],
            site = string.split('://')[1];

        if (protocol === undefined || site === undefined || protocol === "" || site === "") {
            this.website = undefined;
        } else {

            if (site.split('/').length > 1) site = site.split('/')[0];
            if (site.split('?').length > 1) site = site.split('?')[0];

            this.website = protocol + '://' + site;
        }
    };
}


/**
 * Get ico by ID
 * @param id - ObjectID
 * @returns {Promise}
 * @private
 */
let findById_ = (id) => {
    return new Promise((resolve, reject) => {
        MongoClient.connect(process.env.DB_MONGO_URI, mongoSettings)
            .then(client => {
                client.db(process.env.DB_SCRAPING_TABLE).collection(process.env.DB_SCRAPING_COLLECTION).findOne({ _id: ObjectID(id) }, (err, result) => {
                    client.close();
                    if (err) {
                        reject("MongoDB find ico by ID error: " + err);
                    } else {
                        resolve(result);
                    }
                });
            })
            .catch(error => {
                reject('MongoDB could not connect to DB. ' + error);
            })
    });
};


/**
 * Get icos by inQuery
 * @param inQuery.fields - return fields `field1,field2,...`
 * @param inQuery.limit - Number
 * @param inQuery.sort - '{timestamp:1}','{timestamp:-1}','{name:1}','{name:-1}','{website:1}','{website:-1}'
 * @returns {Promise}
 * @private
 */
let getByQuery_ = (inQuery) => {

    return new Promise((resolve, reject) => {
        MongoClient.connect(process.env.DB_MONGO_URI, mongoSettings)
            .then(client => {

                let fields          = inQuery.fields.split('|'),
                    format          = inQuery.format === "excelAPI" ? "excelAPI" : "json",
                    limit           = inQuery.limit ? parseInt(inQuery.limit) : 100,
                    preIcoDateStart = inQuery.preicodatestart ? (IsJsonString(inQuery.preicodatestart) ? JSON.parse(inQuery.preicodatestart) : {}) : {},
                    preIcoDateEnd   = inQuery.preicodateend ? (IsJsonString(inQuery.preicodateend) ? JSON.parse(inQuery.preicodatesend) : {}) : {},
                    icoDateStart    = inQuery.icodatestart ? (IsJsonString(inQuery.icodatestart) ? JSON.parse(inQuery.icodatestart) : {}) : {},
                    icoDateEnd      = inQuery.icodateend ? (IsJsonString(inQuery.icodateend) ? JSON.parse(inQuery.icodateend) : {}) : {};

                let selector = [],
                    len = null,
                    field = null;

                for (let i in fields) {
                    len = 0;
                    field = fields[i].split('.');
                    selector[i] = [];
                    while (len !== field.length) {
                        selector[i].push(field[len++]);
                    }
                }

                let sort = inQuery.sort;

                if (sort === "name") {
                    sort = {name: 1};
                } else if (sort === "!name") {
                    sort = {name: -1};
                } else if (sort === "website") {
                    sort = {website: 1};
                } else if (sort === "!website") {
                    sort = {website: -1};
                } else if (sort === "timestamp") {
                    sort = {timestamp: 1};
                } else if (sort === "!timestamp") {
                    sort = {timestamp: -1};
                } else {
                    sort = {_id: 1};
                }

                let query = {};

                if (preIcoDateStart.from && preIcoDateStart.until)
                    query['dates.preIcoStart'] = { $gte: new Date(preIcoDateStart.from), $lte: new Date(preIcoDateStart.until), $ne: null };
                else if (preIcoDateStart.from)
                    query['dates.preIcoStart'] = { $gte: new Date(preIcoDateStart.from), $ne: null };
                else if (preIcoDateStart.until)
                    query['dates.preIcoStart'] = { $lte: new Date(preIcoDateStart.until), $ne: null };


                if (preIcoDateEnd.from && preIcoDateEnd.until)
                    query['dates.preIcoEnd'] = { $gte: new Date(preIcoDateEnd.from), $lte: new Date(preIcoDateEnd.until), $ne: null };
                else if (preIcoDateEnd.from)
                    query['dates.preIcoEnd'] = { $gte: new Date(preIcoDateEnd.from), $ne: null };
                else if (preIcoDateEnd.until)
                    query['dates.preIcoEnd'] = { $lte: new Date(preIcoDateEnd.until), $ne: null };


                if (icoDateStart.from && icoDateStart.until)
                    query['dates.icoStart'] = { $gte: new Date(icoDateStart.from), $lte: new Date(icoDateStart.until), $ne: null };
                else if (icoDateStart.from)
                    query['dates.icoStart'] = { $gte: new Date(icoDateStart.from), $ne: null };
                else if (icoDateStart.until)
                    query['dates.icoStart'] = { $lte: new Date(icoDateStart.until), $ne: null };


                if (icoDateEnd.from && icoDateEnd.until)
                    query['dates.icoEnd'] = { $gte: new Date(icoDateEnd.from), $lte: new Date(icoDateEnd.until), $ne: null };
                else if (icoDateEnd.from)
                    query['dates.icoEnd'] = { $gte: new Date(icoDateEnd.from), $ne: null };
                else if (icoDateEnd.until)
                    query['dates.icoEnd'] = { $lte: new Date(icoDateEnd.until), $ne: null };


                if (inQuery.name)
                    query['name'] = { $regex: ".*" + inQuery.name.toLowerCase() + ".*" };

                if (inQuery.website)
                    query['website'] = { $regex: ".*" + inQuery.website + ".*" };


                if (inQuery.country)
                    query['maininfo.country'] = { $regex: ".*" + inQuery.country + ".*", $ne: "" };

                if (inQuery.region)
                    query['maininfo.region'] = { $regex: ".*" + inQuery.region + ".*", $ne: "" };


                if (inQuery.token)
                    query['finance.token'] = { $regex: inQuery.token.toUpperCase(), $ne: "" };

                if (inQuery.category)
                    query['finance.category'] = { $regex: inQuery.category, $ne: "" };

                if (inQuery.tokentype)
                    query['finance.tokenType'] = { $regex: inQuery.tokentype, $ne: "" };

                if (inQuery.totaltokens)
                    if (inQuery.totaltokens.search('>') !== -1)
                        query['finance.totalTokens'] = { $gte: parseInt(inQuery.totaltokens.replace(/>/i, '')), $ne: -1 };
                    else if (inQuery.totaltokens.search('<') !== -1)
                        query['finance.totalTokens'] = { $lte: parseInt(inQuery.totaltokens.replace(/</i, '')), $ne: -1 };

                if (inQuery.saletokens)
                    if (inQuery.saletokens.search('>') !== -1)
                        query['finance.saleTokens'] = { $gte: parseInt(inQuery.saletokens.replace(/>/i, '')), $ne: -1 };
                    else if (inQuery.saletokens.search('<') !== -1)
                        query['finance.saleTokens'] = { $lte: parseInt(inQuery.saletokens.replace(/</i, '')), $ne: -1 };

                if (inQuery.salepercent)
                    if (inQuery.salepercent.search('>') !== -1)
                        query['finance.salePercent'] = { $gte: parseInt(inQuery.salepercent.replace(/>/i, '')), $ne: -1 };
                    else if (inQuery.salepercent.search('<') !== -1)
                        query['finance.salePercent'] = { $lte: parseInt(inQuery.salepercent.replace(/</i, '')), $ne: -1 };

                if (inQuery.totalmoney)
                    if (inQuery.totalmoney.search('>') !== -1)
                        query['finance.totalMoney'] = { $gte: parseInt(inQuery.totalmoney.replace(/>/i, '')), $ne: -1 };
                    else if (inQuery.totalmoney.search('<') !== -1)
                        query['finance.totalMoney'] = { $lte: parseInt(inQuery.totalmoney.replace(/</i, '')), $ne: -1 };

                if (inQuery.hardcap)
                    if (inQuery.hardcap.search('>') !== -1)
                        query['finance.hardcap'] = { $gte: parseInt(inQuery.hardcap.replace(/>/i, '')), $ne: -1 };
                    else if (inQuery.hardcap.search('<') !== -1)
                        query['finance.hardcap'] = { $lte: parseInt(inQuery.hardcap.replace(/</i, '')), $ne: -1 };

                if (inQuery.softcap)
                    if (inQuery.softcap.search('>') !== -1)
                        query['finance.softcap'] = { $gte: parseInt(inQuery.softcap.replace(/>/i, '')), $ne: -1 };
                    else if (inQuery.softcap.search('<') !== -1)
                        query['finance.softcap'] = { $lte: parseInt(inQuery.softcap.replace(/</i, '')), $ne: -1 };

                client.db(process.env.DB_SCRAPING_TABLE).collection(process.env.DB_SCRAPING_COLLECTION).find(query).limit(limit).sort(sort).toArray((err, icos) => {
                    client.close();
                    if (err) {
                        reject("MongoDB find icos by query error: " + err);
                    } else {
                        let obj = {},
                            keys = [],
                            keys1 = [],
                            result = [];

                        icos.map(el => {
                            obj = {};

                            if (fields && fields[0] !== "all") {
                                for (let i in selector) {
                                    switch (selector[i].length) {
                                        case 1:
                                            if (format === "excelAPI") {
                                                if (selector[i][0] === "_id" || selector[i][0] === "id") {
                                                    obj["id"] = el["_id"];
                                                } else if (selector[i][0] === "timestamp" || typeof el[selector[i]] === "string" || typeof el[selector[i]] === "number") {
                                                    obj[selector[i][0]] = el[selector[i][0]];
                                                } else if (typeof el[selector[i]] === "object" && el[selector[i]] !== null && el[selector[i]] !== undefined) {
                                                    keys = Object.keys(el[selector[i]]);
                                                    for (let j in keys) {
                                                        if (typeof el[selector[i]][keys[j]] === "string" || typeof el[selector[i]][keys[j]] === "number" || selector[i][0] === "dates") {
                                                            obj[selector[i][0] + "." + keys[j]] = el[selector[i][0]][keys[j]];
                                                        } else if (typeof el[selector[i]][keys[j]] === "object" && el[selector[i]][keys[j]] !== null && el[selector[i]][keys[j]] !== undefined) {
                                                            keys1 = Object.keys(el[selector[i]][keys[j]]);
                                                            for (let k in keys1) {
                                                                obj[selector[i][0] + "." + keys[j] + "." + keys1[k]] = el[selector[i][0]][keys[j]][keys1[k]];
                                                            }
                                                        }
                                                    }
                                                }
                                            } else {
                                                obj[selector[i][0]] = el[selector[i][0]];
                                            }
                                            break;
                                        case 2:
                                            if (format === "excelAPI") {

                                                if (typeof el[selector[i][0]][selector[i][1]] === "string" || typeof el[selector[i][0]][selector[i][1]] === "number" || selector[i][0] === "dates") {
                                                    obj[selector[i][0] + "." + selector[i][1]] = el[selector[i][0]][selector[i][1]];
                                                } else if (typeof el[selector[i]] === "object" && el[selector[i]] !== null && el[selector[i]] !== undefined) {
                                                    keys = Object.keys(el[selector[i][0]][selector[i][1]]);
                                                    for (let j in keys) {
                                                        obj[selector[i][0] + "." + selector[i][1] + "." + keys[j]] = el[selector[i][0]][selector[i][1]][keys[j]];
                                                    }
                                                }
                                            } else {
                                                obj[selector[i][0]] = (obj[selector[i][0]] === undefined) ? {} : obj[selector[i][0]];
                                                obj[selector[i][0]][selector[i][1]] = el[selector[i][0]][selector[i][1]];
                                            }
                                            break;
                                        case 3:
                                            if (format === "excelAPI") {
                                                obj[selector[i][0] + "." + selector[i][1] + "." + selector[i][2]] = el[selector[i][0]][selector[i][1]][selector[i][2]];
                                            } else {
                                                obj[selector[i][0]] = (obj[selector[i][0]] === undefined) ? {} : obj[selector[i][0]];
                                                obj[selector[i][0]][selector[i][1]] = (obj[selector[i][0]][selector[i][1]] === undefined) ? {} : obj[selector[i][0]][selector[i][1]];
                                                obj[selector[i][0]][selector[i][1]][selector[i][2]] = el[selector[i][0]][selector[i][1]][selector[i][2]];
                                            }
                                            break;
                                    }
                                }
                            } else {
                                obj = el;
                            }

                            if (Object.keys(obj).length !== 0)
                                result.push(obj);
                        });
                        resolve(result);
                    }
                })
            })
            .catch(error => {
                reject('MongoDB could not connect to DB. ' + error);
            })
    });
};


/**
 * Update ICO
 * @param data {Object}
 * @private
 */
let update_ = (data) => {
    return new Promise((resolve, reject) => {

        if (data.name === "" || data.name === null || data.name === undefined)
            return reject("Did not receipt ICO name");

        if (data.website === "" || data.website === null || data.website === undefined)
            return reject("Did not receipt ICO website");

        let id = ObjectID(data._id);
        delete data._id;

        MongoClient.connect(process.env.DB_MONGO_URI, mongoSettings)
            .then(client => {
                client.db(process.env.DB_SCRAPING_TABLE).collection(process.env.DB_SCRAPING_COLLECTION)
                    .updateOne({ _id: id }, { $set: data })
                        .then(ico => {
                            client.close();
                            data._id = id;
                            return resolve(data);
                        })
                        .catch(error => {
                            client.close();
                            reject("MongoDB update ICO error: " + error);
                        })
            })
            .catch(error => {
                reject('MongoDB could not connect to DB. ' + error);
            })
    });
};

/**
 * Create new ICO
 * @param data
 * @private
 */
let create_ = (data) => {
    return new Promise((resolve, reject) => {
        if (data.name === "" || data.name === null || data.name === undefined)
            return reject("Did not receipt ICO name");

        if (data.website === "" || data.website === null || data.website === undefined)
            return reject("Did not receipt ICO website");

        MongoClient.connect(process.env.DB_MONGO_URI, mongoSettings)
            .then(client => {

                var collection = client.db(process.env.DB_SCRAPING_TABLE).collection(process.env.DB_SCRAPING_COLLECTION);

                collection.findOne({ website: data.website })
                    .then(result => {
                        if (result !== null) {
                            client.close();
                            return reject("ICO with website [ " + data.website + " ] already existed.");
                        } else {
                            data._id = ObjectID();

                            collection.insertOne(data)
                                .then(ico => {
                                    client.close();
                                    return resolve(data);
                                })
                                .catch(error => {
                                    client.close();
                                    return reject("MongoDB could not create ICO: " + error);
                                });
                        }
                    })
                    .catch(error => {
                        client.close();
                        return reject("MongoDB check ICO by website error: " + error);
                    })
            })
            .catch(error => {
                reject('MongoDB could not connect to DB. ' + error);
            })
    })
};


module.exports = {
    class       : icoClass,
    getByQuery  : getByQuery_,
    getById     : findById_,
    categories  : categories,
    regions     : regions,
    update      : update_,
    create      : create_
};