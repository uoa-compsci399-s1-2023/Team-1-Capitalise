const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { Parameter, validateParameter } = require("../models/parameter");

const semesterRegex = new RegExp(/(S|s)\d{1} (19|20)\d{2}$/);

String.prototype.capitalize = function () {
  return this.replace(/(^|\s)([a-z])/g, function (m, p1, p2) {
    return p1 + p2.toUpperCase();
  });
};

//Gets all categories and sorts by name
const getCategories = async (req, res) => {
  const categories = await Parameter.find({
    parameterType: "category",
  }).sort("name");
  res.send(categories);
};

//Gets all semesters and sorts by semester
const getSemesters = async (req, res) => {
  let sortedArr = [];
  const sortedSemesters = await sortSemesters();
  for (let i = 0; i < sortedSemesters.length; i++) {
    let mySem = await Parameter.findOne({
      parameterType: "semester",
      value: sortedSemesters[i],
    });
    sortedArr.push(mySem);
  }
  res.send(sortedArr);
};

const sortSemesters = async () => {
  const semesters = await Parameter.find({ parameterType: "semester" });

  const semArray = semesters.map((semester) => semester.value.split(" "));

  semArray.sort((a, b) => {
    if (b[1] === a[1]) {
      return b[0] === "S2" ? 1 : -1;
    } else {
      return b[1] - a[1];
    }
  });

  const newSemArray = semArray.map((arr) => arr.join(" "));
  return newSemArray;
};

//Gets all categories and sorts by name
const getSortBys = async (req, res) => {
  const sortBys = await Parameter.find({
    parameterType: "sortBy",
  }).sort("name");
  res.send(sortBys);
};

//Gets all categories and sorts by name
const getAwards = async (req, res) => {
  const awards = await Parameter.find({
    parameterType: "award",
  }).sort("name");
  res.send(awards);
};

const createParameter = async (req, res) => {
  const { error } = validateParameter(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const { value, parameterType } = req.body;

  try {
    //Check if parameter already exists
    const existingParam = await Parameter.findOne({
      value: value.capitalize(),
      parameterType,
    });

    if (existingParam) {
      return res.status(400).send("Error - This parameter already exists!");
    }

    //Check the semester format
    if (parameterType === "semester" && !semesterRegex.test(value)) {
      return res
        .status(400)
        .json({ fail: "Semesters must take on the form of SX 20YY" });
    }

    const parameter = new Parameter({
      value: value.capitalize(),
      parameterType,
    });

    await parameter.save();

    res.status(201).json(parameter);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

const deleteParameter = async (req, res) => {
  try {
    const parameter = await Parameter.findById(req.params.id);

    if (!parameter) {
      return res.status(400).send("Error - The parameter does not exist!");
    }

    await parameter.deleteOne();

    res.json({ removed: `${parameter.value} removed` });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

module.exports = {
  getCategories,
  getSemesters,
  getSortBys,
  getAwards,
  createParameter,
  deleteParameter,
};
