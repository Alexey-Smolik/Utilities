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

app.get('/', function(req, res){
    res.redirect('/auth.html');
});

models.sequelize
    .sync()
    .then(() => {
        app.listen(process.env.PORT || 3000, () => console.log("Server started!"));
    })
    .catch((err) => console.log(err));

module.exports = app;