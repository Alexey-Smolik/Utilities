"use strict";
const routes = require('express').Router();
const bcrypt = require('bcryptjs');
const users = require('../../models').User;
const statistics = require('../../models').Statistics;
const payStatistics = require('../../models').Payments;
const userHelper = require('../../helpers/role.js');

routes.post("/", (req, res) => {
    if (!req.body.firstName || !req.body.lastName || !req.body.email || !req.body.password) {
        res.status(400).send({ status: "error", message: "Wrong params" });
    } else {
        const salt = bcrypt.genSaltSync(10);
        bcrypt.hash(req.body.password, salt, (err, hash) => {
            if (err) {
                res.status(409).send({ status: "error", message: "crypt error" });
            } else {
                users.build({ firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email, password: hash , role: 2})
                .save()
                .then(user => {
                    res.status(201).send({ status: "success", userId: user.dataValues.id });
                })
                .catch(err => {
                    res.status(501).send({ status: "error", message: err.message });
                });
            }
        });
    }
});


routes.get("/:id", (req, res)=>{
    users.findOne({where: { id: req.params.id }})
        .then(result => {
            res.status(200).send({
                name: result.firstName,
                surname: result.lastName,
                email: result.email,
                role: result.role
            });
        })
        .catch(err => {
            res.status(500).send({ status: "error", message: "Server error" });
        });
});


routes.get("/", (req, res) => {
    let limit = req.query.limit || 10;
    let offset = req.query.offset || 0;

    users.findAndCountAll({ attributes: { exclude: 'password' }, limit: limit, offset: offset })
    .then(result => {
        res.status(200).send(result.rows);
    })
    .catch(err => {
        res.status(500).send({ status: "error", message: "Server error" });
    });
});

routes.delete("/:id", (req, res)=>{
    if(!userHelper.checkRole(req.cookies))
        res.status(403).send({ status: "error", message: "You have no rights" });
    else{
        payStatistics.destroy({where: { UserId:req.params.id }}).then(result=> {
            statistics.destroy({where: { UserId: req.params.id }}).then(result => {
                users.destroy({where: { id: req.params.id }}).then(result => {
                    res.status(200).send({status: "success"})
                });
            });
        }).catch(err=>{
            res.status(500).send({ status: "error", message: "Server error" });
        })
    }
});


routes.put("/:id", (req, res)=>{
    if(!userHelper.checkRole(req.cookies))
        res.status(403).send({ status: "error", message: "You have no rights" });
    else{
        users.update({firstName: req.body.name, lastName: req.body.surname, email: req.body.email}, {where: {id: req.params.id}}).then(result=>{
            res.status(200).send({status: "success"});
        }).catch(err=>{
            res.status(500).send({ status: "error", message: err.message });
        })
    }
});

routes.post("/:id", (req, res)=>{
    if(!userHelper.checkRole(req.cookies))
        res.status(403).send({ status: "error", message: "You have no rights" });
    else if(!req.body.role || req.body.role > 2 || req.body.role < 1){
        res.status(403).send({ status: "error", message: "Wrong params" });
    }
    else{
        users.update({role: req.body.role}, {where: {id: req.params.id}}).then(result=>{
            res.status(200).send({status: "success"});
        }).catch(err=>{
            res.status(500).send({ status: "error", message: err.message });
        })
    }
});



module.exports = routes;