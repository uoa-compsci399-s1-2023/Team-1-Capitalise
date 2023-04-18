const { User, validate } = require("../models/user");
const { Project } = require("../models/project");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const { Comment, validateComment } = require("../models/comment");

//Gets all users and sorts by name
const getAllUsers = async (req, res) => {
  //Added populate method to dynamically fetch information of project document!
  const users = await User.find().populate("project", "_id, name").sort("name");
  res.send(users);
};

//Get user by username
const getUserByName = async (req, res) => {
  const { username } = req.params;

  const user = await User.findOne({ username: username }).populate(
    "project",
    "_id, name"
  );
  if (!user) {
    return res.status(404).json({ fail: `no user with ${username} found` });
  }

  res.send(user);
};

//Get user by Id
const getUserById = async (req, res) => {
  const { id } = req.params;

  const username = await User.findOne({ _id: id }).populate(
    "project",
    "_id, name"
  );
  if (!username) {
    return res.status(404).json({ fail: `no user with ${id} found` });
  }

  res.send(username);
};

//Adds new user
const postUser = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Check if the email already exists
  let checkExistingEmail = await User.findOne({ email: req.body.email });
  if (checkExistingEmail)
    return res.status(400).send("Email already registered.");

  //Check if the username already exists
  if (req.body.username) {
    let checkExistingUsername = await User.findOne({
      username: req.body.username,
    });
    if (checkExistingUsername)
      return res.status(400).send("Username already registered.");
  } else {
    req.body.username = req.body.email;
  }

  //Determine if email has aucklanduni.ac.nz domain
  const gradEmailDomain = req.body.email.substring(
    req.body.email.indexOf("@") + 1
  );
  let myUserType = "";
  gradEmailDomain != "aucklanduni.ac.nz"
    ? (myUserType = "visitor")
    : (myUserType = "graduate");

  let user = "";
  let password = await bcrypt.hash(req.body.password, 10);

  if (req.body.projectId) {
    const project = await Project.findById(req.body.projectId);
    if (!project) return res.status(400).send("Invalid project.");

    user = new User({
      name: req.body.name,
      email: req.body.email,
      profilePicture: req.body.profilePicture,
      username: req.body.username,
      password: password,
      links: req.body.links,
      profilePicture: req.body.profilePicture,
      github: req.body.github,
      linkedin: req.body.linkedin,
      project: {
        _id: project._id,
      },
      bio: req.body.bio,
      likedProjects: [],
      myComments: [],
      userType: myUserType,
      isGoogleCreated: false,
    });

    //Append user to project's members
    const appendToProject = await Project.findByIdAndUpdate(
      project._id,
      {
        $push: { members: user },
      },
      { new: true }
    );
  } else {
    user = new User({
      name: req.body.name,
      email: req.body.email,
      profilePicture: req.body.profilePicture,
      username: req.body.username,
      password: password,
      links: req.body.links,
      profilePicture: req.body.profilePicture,
      github: req.body.github,
      linkedin: req.body.linkedin,
      bio: req.body.bio,
      likedProjects: [],
      myComments: [],
      userType: myUserType,
      isGoogleCreated: false,
    });
  }

  user = await user.save();

  const token = user.generateAuthToken();

  res.header("x-auth-token", token).send(user);
};

//Adds new user from Google
const postGoogleUser = async (profile) => {
  const gradEmailDomain = profile.email.substring(
    profile.email.indexOf("@") + 1
  );
  let myUserType = "";
  gradEmailDomain != "aucklanduni.ac.nz"
    ? (myUserType = "visitor")
    : (myUserType = "graduate");

  //Check if the user has a given name and family name
  let suggestedUsername = profile.email
    .substring(0, profile.email.indexOf("@"))
    .toLowerCase();

  // Check if username is taken
  const takenUsername = await User.findOne({ username: suggestedUsername });
  // If yes, change the username to their unique email
  if (takenUsername) {
    suggestedUsername = profile.email;
  }

  //Create the user

  let user = "";

  user = new User({
    name: profile.name,
    email: profile.email,
    username: suggestedUsername,
    profilePicture: profile.picture,
    likedProjects: [],
    myComments: [],
    userType: myUserType,
    isGoogleCreated: true,
  });

  user = await user.save();

  return user;
};

//updates the user details besides the user type
//This method also assumes that if a user doesn't update a field
//The front end form sent will send the user.<parameter> default value
const updateUserDetails = async (req, res) => {
  const { id } = req.params;

  //If user logged in is trying to update someone else
  if (id != req.user._id && req.user.userType !== "admin") {
    return res.status(403).send({ err: "You are trying to edit someone else" });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ err: "Wrong type of id " });
  }

  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ err: "No user found" });
  }

  //look through request body. Also assumes frontend will only give vistor or graduate options
  // to visitor and only admin can update a user and give them admin userType
  //For now, no authorization
  const { name, password, email, username, userType } = req.body;
  const encrypted = await bcrypt.hash(password, 10);
  var updateUser;
  if (userType != "admin") {
    updateUser = await User.findByIdAndUpdate(id, {
      name: name,
      password: encrypted,
      email: email,
      username: username,
      userType: userType,
    });
  } else {
    updateUser = await User.findByIdAndUpdate(id, {
      name: name,
      password: encrypted,
      email: email,
      username: username,
    });
  }

  res.send(updateUser);
};

const deleteUserById = async (req, res) => {
  const { id } = req.params;
  const user = await User.findOne({ _id: id });

  if (user == null) {
    return res.send({ noUser: `User with id ${id} not found` });
  }

  if (id != req.user._id && req.user.userType !== "admin") {
    return res
      .status(403)
      .send({ err: "You are trying to delete someone else!" });
  }

  const username = user.username;
  const projectId = await user.project;

  if (projectId != null) {
    await Project.findByIdAndUpdate(projectId, { $pull: { members: id } });
  }

  await User.findByIdAndDelete(id);
  res.status(200).send({ removed: `${username} removed` });
};

//Need to properly test
const adminDeleteUserById = async (req, res) => {
  const { id } = req.params;
  if (id == req.user._id) {
    return res
      .status(403)
      .send({ err: "You are not allowed to delete yourself" });
  }

  const user = await User.findOne({ _id: id });
  if (user == null) {
    return res.send({ noUser: `User with id ${id} not found` });
  }

  const username = user.username;
  const projectId = await user.project;

  if (projectId != null) {
    await Project.findByIdAndUpdate(projectId, { $pull: { members: id } });
  }

  await User.findByIdAndDelete(id);
  res.status(200).send({ removed: `${username} removed` });
};

const adminUpdateUserDetails = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ err: "Wrong type of id " });
  }

  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ err: "No user found" });
  }

  //look through request body. Also assumes frontend will only give vistor or graduate options
  // to visitor and only admin can update a user and give them admin userType
  //For now, no authorization
  const { name, password, email, username, userType } = req.body;
  const encrypted = await bcrypt.hash(password, 10);

  //Admin can make other users admin
  updateUser = await User.findByIdAndUpdate(id, {
    name: name,
    password: encrypted,
    email: email,
    username: username,
    userType: userType,
  });

  res.send(updateUser);
};

//uses the _id attribute from the JSON web token to grab the session user. Excludes their password.
const getCurrentUser = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
};

//search for users
const searchUsers = async (req, res) => {
  //console.log(req.query.name.split(" "));
  //let myArr = req.query.name.split(" ");
  //let myQueryArr = [];
  //for (let i = 0; i < myArr.length; i++) {
  //  myQueryArr.push({ name: { $regex: myArr[i], $options: "i" } });
  //}
  //console.log(myQueryArr);
  const users = await User.find({
    //$or: myQueryArr,
    name: { $regex: req.query.name, $options: "i" },
  });
  res.send(users);
};

module.exports = {
  getAllUsers,
  getUserByName,
  getUserById,
  postUser,
  updateUserDetails,
  deleteUserById,
  getCurrentUser,
  adminDeleteUserById,
  adminUpdateUserDetails,
  postGoogleUser,
  searchUsers,
};
