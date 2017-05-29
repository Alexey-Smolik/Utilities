"use strict"

const routes = require('express').Router();
const users = require('../../models').User;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../../config.json');

routes.post("/login", (req, res) => {
    if (!req.body.email || !req.body.password) {
        res.status(400).send({ status: "error", message: "Wrong params" });
    }
    else{
        users.findOne({where: {email: req.body.email}})
            .then((user => {
                if(!user)
                    res.status(404).send({ status: "error", message: "Wrong email" })
                else{
                    bcrypt.compare(req.body.password, user.password, (err, success) => {
                        if (success) {
                            let token = jwt.sign({ id: user.id, username: user.username }, config.secret_key);

                            res.cookie("role", user.role);
                            res.cookie("token", token)
                                .send({ id: user.id , role: user.role});
                        } else {
                            res.status(401).send({ status: "error", message: "Wrong password" });
                        }
                    });
                }
            }))
    }
});

routes.post("/logout", (req, res)=> {
    res.cookie("token", "", { expires: new Date(0) }).send({status: "success logout"});
});

module.exports = routes;