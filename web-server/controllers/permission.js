'use strict';

const { Op }    = require('sequelize');
const db        = require('../models');

let addPermission_ = async (data) => {

    let user = await db['users'].findOne({
            where: {
                id: data.id
            }
        });

    if (!user) return;

    return await db['permissions'].create({
        user_id: data.id,
        module: data.module,
        expires_in: data.expires_in
    });
};

let removePermission_ = async (id) => {

    let permission = await db['permissions'].findOne({
            where: {
                id: id
            }
        });

    if (!permission) return;

    permission.destroy();

    return permission;
};

module.exports = {
    addPermission: addPermission_,
    removePermission: removePermission_
};