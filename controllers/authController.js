const { User } = require('../models/user');
const { Project } = require('../models/project');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

const authenticateUser = async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ username: req.body.username });
    if (!user) {
        //return res.status(404).json({ fail: `no user with ${req.body.username} found` }) Better to not let the user know that they didn't find a correct name.
        return res.status(400).send("Invalid username or password.");
    }

    bcrypt.compare(req.body.password, user.password, function (err, result) {
        if (result === false) {
            return res.status(400).send("Invalid username or password.");
        } else {
            const token = user.generateAuthToken();
            res.send(token);
        }
    });

}


function validate(req) {
    const schema = Joi.object({
        username: Joi.string().min(3).required(),
        password: Joi.string().min(3).required()
    });

    return schema.validate(req);
}


module.exports = {
    authenticateUser,
}