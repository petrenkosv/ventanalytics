module.exports = (sequelize, Sequelize) => {

    'use strict';

    const curTableName = 'sites';

    let Model = sequelize.define(curTableName, {
        id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV1,
        },
        host: Sequelize.STRING(256),
    }, {
        tableName: curTableName,
        timestamps: false,
        paranoid: false,
        underscored: true,
        freezeTableName: true,
    });
    
    Model.associate = function(models) {
        models[curTableName].hasMany(models['visits_log'], { as: 'visits_log' } );
    };

    Model.prototype.toJSON =  function () {
        return Object.assign({}, this.get());
    };

    return Model;
};
