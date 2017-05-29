"use strict"
const routes = require('express').Router();
const Statistics = require('../../models').Statistics;
const utility = require('../../models').Utility;
const users = require('../../models').User;
const statisticsHelper = require('../../helpers/role.js');

routes.post("/", (req, res)=>{
    if (!req.body.UserId || !req.body.UtilityId) {
        res.status(400).send({ status: "error", message: "Wrong params" });
    }
    else {
        let arrear = req.body.arrear || 1000;
        let lastPayment = req.body.lastPayment || null;

        Statistics.build({ arrear: arrear, lastPayment: lastPayment, UserId: req.body.UserId, UtilityId: req.body.UtilityId })
            .save()
            .then(user => {
                res.status(201).send({ status: "success" });
            })
            .catch(err => {
                res.status(501).send({ status: "error", message: err.message });
            });
        }
});


routes.get("/", (req, res)=>{
    Statistics.findAndCountAll({ include: [{model: utility}, {model: users}]})
        .then(result => {
            res.send(
                result.rows.map(stat => {
                    var lastPayment
                    if(stat.lastPayment == null)
                        lastPayment = "-";
                    else
                        lastPayment = stat.lastPayment;
                    return {
                        id: stat.id,
                        Name: stat.User.firstName,
                        Surname: stat.User.lastName,
                        utility: stat.Utility.name,
                        arrear: stat.arrear,
                        lastPayment: lastPayment
                    }
                })
            );
        })
        .catch(err => {
            res.status(500).send({ status: "error", message: err.message });
        });
});

routes.get("/:id", (req, res)=>{
    Statistics.findAndCountAll({where: { userId: req.params.id }, include: [{model: utility}, {model: users}]})
        .then(result => {
            res.send(
                result.rows.map(stat => {
                    var lastPayment
                    if(stat.lastPayment == null)
                        lastPayment = "-";
                    else
                        lastPayment = stat.lastPayment;
                    return {
                        statistics:{
                            id: stat.id,
                            utility: stat.Utility.name,
                            arrear: stat.arrear,
                            lastPayment: lastPayment
                        },
                        user:{
                            userName: stat.User.firstName,
                            userSurname: stat.User.lastName
                        }
                    }
                })
            );
        })
        .catch(err => {
            res.status(500).send({ status: "error", message: "Server error" });
        });
});

routes.delete("/:id", (req, res)=>{
    if(!statisticsHelper.checkRole(req.cookies))
        res.status(403).send({ status: "error", message: "You have no rights" });
    else{
        Statistics.destroy({where: { id: req.params.id }}).then(result=>{
            res.status(200).send({ status: "success" })
        }).catch(err=>{
            res.status(500).send({ status: "error", message: "Server error" });
        })
    }
});

routes.put("/:id", (req, res)=>{
    if(!statisticsHelper.checkRole(req.cookies))
        res.status(403).send({ status: "error", message: "You have no rights" });
    else if(!req.body.arrear)
        res.status(400).send({ status: "error", message: "Wrong params" });
    else{
        Statistics.update({ arrear: req.body.arrear }, {where: {id: req.params.id}}).then(result=>{
            res.status(200).send({ status: "success" })
        }).catch(err=>{
            res.status(500).send({ status: "error", message: "Server error" });
        })
    }
});


module.exports = routes;