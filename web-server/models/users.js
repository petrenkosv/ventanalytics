module.exports = (sequelize, Sequelize) => {

    'use strict';

    const curTableName = 'users';

    let Model = sequelize.define(curTableName, {
        id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV1
        },
        name: Sequelize.STRING(128),
        username: Sequelize.STRING(64),
        password: Sequelize.STRING(256),
        email: Sequelize.STRING(128),
        status: Sequelize.SMALLINT, // 0 - inactive, 1 - active, 2 - blocked, 3 - deleted
        settings: Sequelize.JSON,
    }, {
        tableName: curTableName,
        timestamps: true,
        paranoid: true,
        underscored: true,
        freezeTableName: true,
    });

    Model.associate = function(models) {
        models[curTableName].hasOne(models['tokens_api'], { as: 'tokens_api', foreignKey: 'user_id', sourceKey: 'id' } );
        models[curTableName].hasMany(models['permissions'], { as: 'permissions' } );
        models[curTableName].hasMany(models['portfolios'], { as: 'portfolios' } );
    };

    Model.prototype.toJSON =  function () {
        let values = Object.assign({}, this.get());

        delete values.password;
        return values;
    };

    return Model;
};
