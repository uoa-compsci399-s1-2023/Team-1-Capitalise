const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { Parameter, validateParameter } = require("../models/parameter");
const { Project } = require("../models/project");

const semesterRegex = new RegExp(/((S|s)\d{1} (19|20)\d{2}$|SX 20XX)/);

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

const getSemesters = async (req, res) => {
  mySems = await Parameter.aggregate([
    {
      $match: { parameterType: "semester" },
    },
    {
      $project: {
        value: 1,
        parameterType: 1,
        year: { $substr: ["$value", 3, -1] },
        sem: { $substr: ["$value", 0, 2] },
      },
    },
    {
      $addFields: {
        isSX: {
          $cond: { if: { $eq: ["$value", "SX 20XX"] }, then: 1, else: 0 },
        },
      },
    },
    {
      $sort: { isSX: 1, year: -1, sem: -1 },
    },
    {
      $project: {
        value: 1,
        parameterType: 1,
      },
    },
  ]);

  res.send(mySems);
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

  const { value, parameterType, image } = req.body;
  let hexString = "0123456789abcdef";
  let randomColor = () => {
    let hexCode = "#";
    for (i = 0; i < 6; i++) {
      hexCode += hexString[Math.floor(Math.random() * hexString.length)];
    }
    return hexCode;
  };
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

    let parameter = "";
    if (parameterType === "award") {
      parameter = new Parameter({
        value: value.capitalize(),
        image: image,
        parameterType,
        gradient: [randomColor(), randomColor()],
      });
    } else {
      parameter = new Parameter({
        value: value.capitalize(),
        parameterType,
      });
    }

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

    //Check if parameter is Miscellaneous category or SX 20XX semester. Do NOT allow these to be deleted.
    if (
      (parameter.parameterType === "category" &&
        parameter.value === "Miscellaneous") ||
      (parameter.parameterType === "semester" && parameter.value === "SX 20XX")
    ) {
      return res.status(400).send({
        fail: "Error - You cannot delete this parameter! It is required by the system for error handling!",
      });
    }

    //If the parameter is a category, change all projects with this category to miscellaneous
    if (parameter.parameterType === "category") {
      const misc = await Parameter.findOne({
        value: "Miscellaneous",
        parameterType: "category",
      });

      await Project.updateMany(
        {
          category: parameter._id,
        },
        {
          category: misc._id,
        }
      );
    } //If the parameter is a semester, change the semester to SX 20XX
    else if (parameter.parameterType === "semester") {
      const miscSem = await Parameter.findOne({
        value: "SX 20XX",
        parameterType: "semester",
      });

      await Project.updateMany(
        {
          semester: parameter._id,
        },
        {
          semester: miscSem._id,
        }
      );
    } //If the parameter is an award, remove the award from all projects that have it
    else if (parameter.parameterType === "award") {
      await Project.updateMany(
        {
          award: parameter._id,
        },
        {
          award: null,
        }
      );
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
