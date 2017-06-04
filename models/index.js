"use strict";

var fs        = require("fs");
var path      = require("path");
var Sequelize = require("sequelize");
var config = require('../config.json');
var password = config.password ? config.password : "";
var sequelize;
if(process.env.NODE_ENV == 'production'){
    const options = {
        host: config.prod.host,
        dialect: config.prod.dialect,
        logging: false,
        define: {
            timestamps: true,
            paranoid: true
        }
    };
    sequelize = new Sequelize(config.prod.name, config.prod.user, config.prod.password, options);
}
else{
    sequelize = new Sequelize(config.db.driver + "://" + config.db.username + ":" + password + "@" + config.db.host + ":" + config.db.port + "/" + config.db.dbname, {logging: false});
}
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