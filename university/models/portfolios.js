module.exports = (sequelize, Sequelize) => {

    'use strict';

    const curTableName = 'portfolios';

    let Model = sequelize.define(curTableName, {
        id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV1,
        },
        user_id: {
            allowNull: false,
            type: Sequelize.UUID
        },
        name: Sequelize.STRING(128)
    }, {
        tableName: curTableName,
        timestamps: true,
        paranoid: true,
        underscored: true,
        freezeTableName: true,
    });
    
    Model.associate = function(models) {
        models[curTableName].belongsToMany(models['projects'], { through: 'portfolios_projects', timestamps: false });
        models[curTableName].hasMany(models['portfolios_analysis'], { as: 'portfolios_analysis' });
    };

    return Model;
};
