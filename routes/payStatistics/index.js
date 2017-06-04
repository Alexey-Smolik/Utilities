"use strict"
const routes = require('express').Router();
const payStatistics = require('../../models').Payments;
const utility = require('../../models').Utility;
const users = require('../../models').User;
const statisticsHelper = require('../../helpers/role.js');

routes.post("/", (req, res)=>{
    if (!req.body.UtilityId || !req.body.UserId || !req.body.amount) {
        res.status(400).send({ status: "error", message: "Wrong params" });
    }
    else {
        const time = new Date;
        payStatistics.build({ UtilityId: req.body.UtilityId, UserId: req.body.UserId, amount: req.body.amount, Date: time })
            .save()
            .then(result => {
                res.status(201).send({ status: "success", payStatisticsId: result.dataValues.id });
            })
            .catch(err => {
                res.status(400).send({ status: "error", message: "Server error" });
            });
    }
});


routes.get("/", (req, res)=>{
    payStatistics.findAndCountAll({ include: [{model: utility}, {model: users}]})
        .then(result => {
            res.status(200).send(
                result.rows.map(stat => {
                    return {
                        Id: stat.id,
                        Amount: stat.amount,
                        Date: stat.Date,
                        Name: stat.User.firstName,
                        Surname: stat.User.lastName,
                        UtilityName: stat.Utility.name
                    }
                })
            );
        })
        .catch(err => {
            res.status(500).send({ status: "error", message: "Server error" });
        });
});

routes.get("/:id", (req, res)=>{
    payStatistics.findAndCountAll({where: { UserId: req.params.id }, include: [{model: utility}, {model: users}]})
        .then(result => {
            res.status(200).send(
                result.rows.map(stat => {
                    return {
                        payStatistics:{
                            id: stat.id,
                            UtilityName: stat.Utility.name,
                            Amount: stat.amount,
                            Date: stat.Date
                        },
                        user:{
                            Name: stat.User.firstName,
                            Surname: stat.User.lastName
                        }
                    }
                })
            );
        })
        .catch(err => {
            res.status(500).send({ status: "error", message: err.message });
        });
});

routes.delete("/:id", (req, res)=>{
    if(!statisticsHelper.checkRole(req.cookies))
        res.status(403).send({ status: "error", message: "You have no rights" });
    else{
        payStatistics.destroy({where: { id: req.params.id }}).then(result=>{
            res.status(200).send({ status: "success" })
        }).catch(err=>{
            res.status(500).send({ status: "error", message: "Server error" });
        })
    }
});

module.exports = routes;