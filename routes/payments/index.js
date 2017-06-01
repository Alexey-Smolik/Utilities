"use strict"

const routes = require("express").Router();
const statistics = require('../../models').Statistics;
const payStat = require('../../models').Payments;
const utility = require('../../models').Utility;
const users = require('../../models').User;
var valid = require('card-validator');

const payHelper = require('../../helpers/payments.js');

routes.put("/:id", (req, res) => {
    if (!req.body.amount || !req.body.cardNumber) {
        res.status(400).send({status: "error", message: "Wrong params"});
    }
    else {
        var numberValidation = valid.number(req.body.cardNumber.toString());

        if (!numberValidation.isPotentiallyValid) {
            res.status(400).send({status: "error", message: "Invalid card number"});
            return;
        }
        else{
            statistics.findById(req.params.id).then(result => {
                if (result.arrear === 0)
                    res.status(403).json({message: "No debt"});
                else {
                    const time = new Date;
                    const arrear = payHelper.checkBalance(result.arrear - req.body.amount);
                    statistics.update({arrear: arrear, lastPayment: time}, {where: {id: req.params.id}})
                        .then(result => {
                            statistics.findOne({where: {id: req.params.id}, include: [{model: utility}, {model: users}]})
                                .then(stat => {
                                    payStat.build({
                                        UtilityId: stat.UtilityId,
                                        UserId: stat.UserId,
                                        amount: req.body.amount,
                                        Date: stat.lastPayment
                                    })
                                        .save()
                                        .then(user => res.status(201).send({status: "success"}))
                                })
                        })
                }
            })
                .catch(err =>  res.status(501).send({status: "error", message: err.message}))
        }
    }
});

module.exports = routes;