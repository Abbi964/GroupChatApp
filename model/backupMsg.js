const {Sequelize, DataTypes} = require('sequelize');

const sequelize = require('../util/database');

let BackupMsg = sequelize.define('backupMsg',{
    id : {
        type : DataTypes.INTEGER,
        primaryKey : true,
        allowNull : false,
        autoIncrement : true,
    },
    message : {
        type : DataTypes.STRING,
        allowNull : false,
    },
    username : {
        type : DataTypes.STRING,
        allowNull : false,
    },
    userId : {
        type : DataTypes.INTEGER,
        allowNull : false,
    },
    groupId : {
        type : DataTypes.INTEGER,
        allowNull : false,
    }
})

module.exports = BackupMsg;