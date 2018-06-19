module.exports = (sequelize, Sequelize) => {

    'use strict';

    let Model = sequelize.define('token-indexes', {
        mode_day     : Sequelize.BOOLEAN,
        mode_week    : Sequelize.BOOLEAN,
        mode_month   : Sequelize.BOOLEAN,
        mode_quarter : Sequelize.BOOLEAN,
        mode_year    : Sequelize.BOOLEAN,
        value        : Sequelize.FLOAT,
        label        : Sequelize.DATE

    }, {
        timestamps: false,
        underscored: true,
        freezeTableName: true,
    });

    return Model;

};