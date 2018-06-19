module.exports = (sequelize, Sequelize) => {

    'use strict';

    const curTableName = 'payments';

    let Model = sequelize.define(curTableName, {
        id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV1,
        },
        account_id: {
            allowNull: false,
            type: Sequelize.UUID,
        },
        name: Sequelize.STRING(128),
        type: Sequelize.STRING(64),
        price: Sequelize.FLOAT,
        packages: Sequelize.ARRAY(Sequelize.SMALLINT)
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
