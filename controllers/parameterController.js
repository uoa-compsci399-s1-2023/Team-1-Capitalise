const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Parameter, validateParameter } = require('../models/parameter');



//Gets all categories and sorts by name
const getCategories = async (req, res) => {
    const categories = await Parameter.find({
        parameterType: "category"
    }).sort('name');
    res.send(categories);
}

//Gets all categories and sorts by name
const getSemesters = async (req, res) => {
    const semesters = await Parameter.find({
        parameterType: "semester"
    }).sort('name');
    res.send(semesters);
}

//Gets all categories and sorts by name
const getSortBys = async (req, res) => {
    const sortBys = await Parameter.find({
        parameterType: "sortBy"
    }).sort('name');
    res.send(sortBys);
}

//Gets all categories and sorts by name
const getAwards = async (req, res) => {
    const awards = await Parameter.find({
        parameterType: "award"
    }).sort('name');
    res.send(awards);
}

//Create a parameter for a project
const createParameter = async (req, res) => {
    const { error } = validateParameter(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Check if parameter already exists
    const existingParam = await Parameter.findOne({
        value: req.body.value,
        parameterType: req.body.parameterType
    });

    if (existingParam) return res.status(400).send("Error - This parameter already exists!");

    let parameter = new Parameter({
        value: req.body.value,
        parameterType: req.body.parameterType
    });

    parameter = await parameter.save();

    res.send(parameter);
}

module.exports = {
    getCategories,
    getSemesters,
    getSortBys,
    getAwards,
    createParameter
}