const {Sequelize , DataTypes} = require('sequelize')

const sequelize = require('../util/database');

const Message = sequelize.define('message',{
    id : {
        type : DataTypes.INTEGER,
        primaryKey : true,
        allowNull : false,
        autoIncrement : true,
    },
    message : {
        type : DataTypes.STRING,
        allowNull : false,
    }
})

module.exports = Message