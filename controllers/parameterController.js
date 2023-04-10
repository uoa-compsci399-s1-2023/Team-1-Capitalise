const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Parameter } = require('../models/parameter');


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

module.exports = {
    getCategories,
    getSemesters,
    getSortBys,
    getAwards,
}