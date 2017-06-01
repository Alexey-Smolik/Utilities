const express = require('express');
const app = express();
const routes = require('./routes');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const models = require('./models');
const path = require("path");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/api', routes);

models.sequelize.sync().then(app.listen(3000)).then(console.log("Server started!"));

module.exports = app;