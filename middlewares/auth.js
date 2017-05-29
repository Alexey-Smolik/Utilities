"use strict";

module.exports = function (req, res, next) {
    if(!req.cookies.token){
        res.status(401).send({status: "error", message: "you are not loged in"})
    }
    next();
}