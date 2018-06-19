module.exports = (sequelize, Sequelize) => {

    'use strict';

    const curTableName = 'projects';

    let Model = sequelize.define(curTableName, {
        id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV1,
        },
        name: Sequelize.STRING(128),
        website: Sequelize.STRING(128),
        p_hardcap: Sequelize.FLOAT,
        social_rate: Sequelize.FLOAT,
        risk_rate: Sequelize.FLOAT,
        //attribute1: Sequelize.?,
        //attribute2: Sequelize.?,
    }, {
        tableName: curTableName,
        timestamps: true,
        paranoid: false,
        underscored: true,
        freezeTableName: true,
    });
    
    Model.associate = function(models) {

    };

    return Model;
};
