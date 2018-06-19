module.exports = (sequelize, Sequelize) => {

    'use strict';

    const curTableName = 'permissions';

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
        module: Sequelize.STRING(64),
        expires_in: Sequelize.DATE
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

    Model.prototype.getModule =  function () {
        return this.module;
    };

    return Model;
};
