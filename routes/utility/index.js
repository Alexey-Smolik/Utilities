"use strict"
const routes = require('express').Router();
const utility = require('../../models').Utility;
const statistics = require('../../models').Statistics;
const payStatistics = require('../../models').Payments;
const userHelper = require('../../helpers/role.js');

routes.post("/", (req, res)=>{
    if (!req.body.name) {
        res.status(400).send({ status: "error", message: "Wrong params" });
    }
    else {
        utility.build({ name: req.body.name })
            .save()
            .then(result => {
                res.status(201).send({ status: "success", utilityId: result.dataValues.id });
            })
            .catch(err => {
                res.status(501).send({ status: "error", message: "Server error" });
            });
    }
});


routes.get("/", (req, res)=>{
    let limit = req.query.limit || 10;
    let offset = req.query.offset || 0;

    utility.findAndCountAll({ limit: limit, offset: offset })
        .then(result => {
            res.status(200).send(result.rows.map(utility => { return {
                            id: utility.id,
                            name: utility.name
                    }
                })
            )
        })
        .catch(err => {
            res.status(500).send({ status: "error", message: "Server error" });
        });
})

routes.delete("/:id", (req, res)=>{
    if(!userHelper.checkRole(req.cookies))
        res.status(403).send({ status: "error", message: "You have no rights" });
    else{
        payStatistics.destroy({where: { UtilityId:req.params.id }}).then(result=>{
            statistics.destroy({where: { UtilityId:req.params.id }}).then(result=>{
                utility.destroy({where: { id:req.params.id }}).then(result=>{
                    res.status(200).send({status: "success"});
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
    else if (!req.body.name) {
        res.status(400).send({status: "error", message: "Wrong params"});
    }
    else{
        utility.update({name: req.body.name}, {where: {id: req.params.id}}).then(result=>{
            res.status(200).send({status: "success"});
        }).catch(err=>{
            res.status(500).send({ status: "error", message: "Server error" });
        })
    }
});



module.exports = routes;