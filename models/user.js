"use strict"
module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                isEmail: true
            }
        },
        password: {
            type: DataTypes.CHAR(60)
        },
        role:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
    }, {
        timestamps: false
    });

    return User;
};