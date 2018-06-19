module.exports = (sequelize, Sequelize) => {

    'use strict';

    const curTableName = 'packages';

    let Model = sequelize.define(curTableName, {
        id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.SMALLINT,
        },
        price: Sequelize.FLOAT,
        module: Sequelize.STRING(64),
        name: Sequelize.STRING(128),
        description: Sequelize.STRING(512),
        options: Sequelize.JSON,
    }, {
        tableName: curTableName,
        timestamps: true,
        paranoid: true,
        underscored: true,
        freezeTableName: true,
    });
    
    Model.associate = function(models) {
        
    };

    return Model;
};
