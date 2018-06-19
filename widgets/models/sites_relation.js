module.exports = (sequelize, Sequelize) => {

    'use strict';

    const curTableName = 'sites_relation';

    let Model = sequelize.define(curTableName, {
        id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV1,
        },
        site_id: {
            allowNull: false,
            type: Sequelize.UUID,
        },
        user_id: {
            allowNull: false,
            type: Sequelize.UUID,
        },
    }, {
        tableName: curTableName,
        timestamps: false,
        paranoid: false,
        underscored: true,
        freezeTableName: true,
    });
    
    Model.associate = function(models) {
        models['sites'].belongsToMany(models['users'], { through: models[curTableName] } );
        models['users'].belongsToMany(models['sites'], { through: models[curTableName] } );
    };

    return Model;
};
