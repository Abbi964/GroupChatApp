const {Sequelize, DataTypes} = require('sequelize');

const sequelize = require('../util/database');

const Group = sequelize.define('group',{
    id : {
        type : DataTypes.STRING,
        allowNull : false,
        primaryKey : true,
    },
    name:{
        type : DataTypes.STRING,
        allowNull : false,
    }
});

module.exports = Group;