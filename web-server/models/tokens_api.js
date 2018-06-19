module.exports = (sequelize, Sequelize) => {

    'use strict';

    const curTableName = 'tokens_api';

    let Model = sequelize.define(curTableName, {
        token: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.STRING(64),
        },
        user_id: {
            allowNull: false,
            type: Sequelize.UUID,
        },
        active: Sequelize.BOOLEAN,
        valid_date: Sequelize.DATE,
        requests: {
            allowNull: false,
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        limits: Sequelize.INTEGER,
    }, {
        tableName: curTableName,
        updatedAt: false,
        paranoid: false,
        underscored: true,
        freezeTableName: true,
    });
    
    Model.associate = function(models) {
        models[curTableName].hasMany(models['tokens_api_history'], { as: 'tokens_api_history', foreignKey: 'token', sourceKey: 'token' });
    };

    Model.prototype.toJSON =  function () {
        return Object.assign({}, this.get());
    };

    return Model;
};