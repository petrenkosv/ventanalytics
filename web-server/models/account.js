module.exports = (sequelize, Sequelize) => {

    'use strict';

    const curTableName = 'accounts';

    let Model = sequelize.define(curTableName, {
        id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV1,
        },
        user_id: {
            allowNull: false,
            type: Sequelize.UUID,
        },
        packages: Sequelize.ARRAY(Sequelize.SMALLINT),
        balance: Sequelize.FLOAT,
        payments_day: Sequelize.DATE,
    }, {
        tableName: curTableName,
        createdAt: false,
        paranoid: false,
        underscored: true,
        freezeTableName: true,
    });
    
    Model.associate = function(models) {
        models[curTableName].hasMany(models['payments'], { as: 'payments' });
        models[curTableName].belongsTo(models['users'], { foreignKey: 'user_id', targetKey: 'id' });
    };

    return Model;
};
