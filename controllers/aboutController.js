const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { About, validateAbout } = require("../models/about");

const getAllAbouts = async (req, res) => {
  const about = await About.find();
  return res.status(200).send(about);
};

const getAboutById = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send({ fail: "Wrong type of id" });
  }
  const about = await About.findById(req.params.id);
  return res.status(200).send(about);
};

const addAbout = async (req, res) => {
  const { error } = validateAbout(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  try {
    about = new About({
      title: req.body.title,
      body: req.body.body,
    });

    about = await about.save();
    res.status(201).send(about);
  } catch (err) {
    return res.status(500).send(`Server Error: ${err}`);
  }
};

const editAbout = async (req, res) => {
  const { error } = validateAbout(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  try {
    about = await About.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.send(about);
  } catch (err) {
    return res.status(500).send(`Server Error: ${err}`);
  }
};

const deleteAbout = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).send({ fail: "Wrong type of id" });
  }

  try {
    myAbout = await About.findById(req.params.id);
    await About.findByIdAndDelete(req.params.id);
    res.status(200).send({removed: `Section ${myAbout._id} was succesfully deleted.`});
  } catch (err) {
    return res.status(500).send(`Server Error: ${err}`);
  }
};

module.exports = {
  getAllAbouts,
  getAboutById,
  addAbout,
  editAbout,
  deleteAbout,
};
