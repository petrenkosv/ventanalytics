module.exports = (sequelize, Sequelize) => {

    'use strict';

    const curTableName = 'tokens_api_history';

    let Model = sequelize.define(curTableName, {
        id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV1,
        },
        token: {
            allowNull: false,
            type: Sequelize.STRING(64)
        },
        requests: {
            allowNull: false,
            type: Sequelize.INTEGER,
            defaultValue: 0
        }
    }, {
        tableName: curTableName,
        updatedAt: false,
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
