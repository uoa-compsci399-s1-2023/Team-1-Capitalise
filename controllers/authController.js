const { User } = require('../models/user');
const { Project } = require('../models/project');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();


//Main authentication handler
const authenticateUser = async (req, res) => {

    //Use Joi to validate the req.body. POST JSON object should have a username and password.
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Check if a user exists with the same username specified in the request.
    let user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(400).send("Invalid username or password.");

    //Compare the password specified in the request password with that stored in the database.
    bcrypt.compare(req.body.password, user.password, function (err, result) {
        if (result === false) {
            return res.status(400).send("Invalid username or password.");
        } else {
            const token = user.generateAuthToken();
            res.send(token);
        }
    });

}

//Creates a Joi schema which requires a JSON object containing username and password specifiied by the client.
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