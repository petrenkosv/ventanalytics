module.exports = (sequelize, Sequelize) => {

    'use strict';

    const curTableName = 'portfolios_analysis';

    let Model = sequelize.define(curTableName, {
        id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV1,
        },
        portfolio_id: {
            allowNull: false,
            type: Sequelize.UUID,
        },
        balance: Sequelize.FLOAT,
        capitalization_rate: Sequelize.FLOAT,
        risk_rate: Sequelize.FLOAT
    }, {
        tableName: curTableName,
        updatedAt: false,
        paranoid: false,
        underscored: true,
        freezeTableName: true,
    });
    
    Model.associate = function(models) {

    };

    return Model;
};
