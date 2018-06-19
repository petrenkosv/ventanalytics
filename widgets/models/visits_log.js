module.exports = (sequelize, Sequelize) => {

    'use strict';

    const curTableName = 'visits_log';

    let Model = sequelize.define(curTableName, {
        id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV1,
        },
        site_id: {
            allowNull: false,
            type: Sequelize.UUID,
        },
        visits_all: {
            allowNull: false,
            defaultValue: 0,
            type: Sequelize.INTEGER,
        },
        visits_uniq: {
            allowNull: false,
            defaultValue: 0,
            type: Sequelize.INTEGER,
        },
        date: Sequelize.DATE,
    }, {
        tableName: curTableName,
        timestamps: false,
        paranoid: false,
        underscored: true,
        freezeTableName: true,
    });
    
    Model.associate = function(models) {

    };

    Model.prototype.toJSON =  function () {
        return Object.assign({}, this.get());
    };

    return Model;
};
