const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
Joi.objectId = require("joi-objectid")(Joi);

const aboutSchema = new mongoose.Schema({
    title: {
        type: String
    },
    body: {
        type: String
    }
});


const About = mongoose.model('about', aboutSchema);

function validateabout(about) {
    const schema = Joi.object({
        title: Joi.string(),
        body: Joi.string()
    });

    return schema.validate(about);
}

exports.aboutSchema = aboutSchema;
exports.About = About;
exports.validateAbout = validateabout;