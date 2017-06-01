"use strict";

var fs        = require("fs");
var path      = require("path");
var Sequelize = require("sequelize");
var config = require('../config.json')["db"];
var password = config.password ? config.password : "";
var sequelize = new Sequelize(config.driver + "://" + config.username + ":" + password + "@" + config.host + ":" + config.port + "/" + config.dbname, {logging: false});
var db = {};

fs
    .readdirSync(__dirname)
    .filter(function(file) {
        return (file.indexOf(".") !== 0) && (file !== "index.js");
    })
    .forEach(function(file) {
        var model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(function(modelName) {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});

db.User.hasOne(db.Statistics);
db.Utility.hasOne(db.Statistics);

db.Statistics.belongsTo(db.Utility);
db.Statistics.belongsTo(db.User);



db.User.hasOne(db.Payments);
db.Utility.hasOne(db.Payments);

db.Payments.belongsTo(db.User);
db.Payments.belongsTo(db.Utility);


db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;