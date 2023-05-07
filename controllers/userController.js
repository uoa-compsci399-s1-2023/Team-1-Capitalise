const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const { User, validate } = require("../models/user");
const { Project } = require("../models/project");
const { Comment, validateComment } = require("../models/comment");

// Gets all users and sorts by name
const getAllUsers = async (req, res) => {
  // Added populate method to dynamically fetch information of project document!
  const users = await User.find().populate("project", "_id, name").sort("name");
  res.send(users);
};


//Get user by Id
const getUserById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ fail: `${id} is not a valid ID!` });

  const user = await User.findOne({ _id: id }).populate("project", "_id, name");

  if (!user) {
    return res.status(404).json({ fail: `no user with id ${id} found!` });
  }

  res.send(user);
};

// Adds new user
const postUser = async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
  return res.status(400).send(error.details[0].message);
  }
  
  // Check if the email already exists
  let user = await User.findOne({ email: req.body.email });
  if (user) {
  return res.status(400).json({ fail: `Email ${user.email} already exists!` });
  }
  
  // Check if the username already exists
  if (req.body.username) {
  user = await User.findOne({ username: req.body.username });
  if (user) {
  return res.status(400).send("Username already registered.");
  }
  } else {
  req.body.username = req.body.email;
  }
  
  // Determine user type based on email domain
  const gradEmailDomain = req.body.email.substring(req.body.email.indexOf("@") + 1);
  let myUserType = "";
  if (req.body.email === "asma.shakil@auckland.ac.nz") {
  myUserType = "admin";
  } else if (gradEmailDomain !== "aucklanduni.ac.nz") {
  myUserType = "visitor";
  } else {
  myUserType = "graduate";
  }
  
  // Hash password
  const password = await bcrypt.hash(req.body.password, 10);
  
  // Create user object
  user = new User({
  name: req.body.name,
  email: req.body.email,
  username: req.body.username,
  password: password,
  profilePicture: req.body.profilePicture,
  links: req.body.links,
  project: req.body.projectId ? { _id: req.body.projectId } : undefined,
  bio: req.body.bio,
  likedProjects: [],
  myComments: [],
  userType: myUserType,
  isGoogleCreated: false,
  skills: req.body.skills,
  });
  
  // If project ID provided, append user to project's members
  if (req.body.projectId) {
  const project = await Project.findById(req.body.projectId);
  if (!project) {
  return res.status(400).json({ fail: `Invalid projectId provided!` });
  }
  project.members.push(user);
  await project.save();
  }
  
  // Save user and generate token
  user = await user.save();
  const token = user.generateAuthToken();
  
  // Return response with user object and token in header
  res.header("x-auth-token", token).status(201).send(user);
  };
  
  // Adds new user from Google
  const postGoogleUser = async (profile) => {
  const gradEmailDomain = profile.email.substring(profile.email.indexOf("@") + 1);
  let myUserType = "";
  if (profile.email === "asma.shakil@auckland.ac.nz") {
  myUserType = "admin";
  } else if (gradEmailDomain !== "aucklanduni.ac.nz") {
  myUserType = "visitor";
  } else {
  myUserType = "graduate";
  }
  
  // Create user object
  const user = new User({
  name: profile.name,
  email: profile.email,
  username: profile.email,
  profilePicture: profile.picture,
  likedProjects: [],
  myComments: [],
  userType: myUserType,
  isGoogleCreated: true,
  });
  
  // Save user and return
  return await user.save();
  };

//updates the user details besides the user type
//This method also assumes that if a user doesn't update a field
//The front end form sent will send the user.<parameter> default value
const updateUserDetails = async (req, res) => {
  const { id } = req.params;

  if (id !== req.user._id && req.user.userType !== "admin") {
    return res.status(403).json({ fail: "You are not authorized to edit this user" });
  }

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ fail: "Invalid user ID" });
  }

  const user = await User.findById(id);
  if (!user) {
    return res.status(400).json({ fail: "User not found" });
  }

  if (req.body.password) {
    req.body.password = await bcrypt.hash(req.body.password, 10);
  }

  if (req.user.userType !== "admin") {
    delete req.body.userType;
  }

  if (req.body.email) {
    req.body.username = req.body.email;
  }

  const updateUser = await User.findByIdAndUpdate(id, req.body, { new: true });
  res.json(updateUser);
};

const deleteUserById = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({ fail: `User with id ${id} not found` });
  }

  if (id !== req.user._id && req.user.userType !== "admin") {
    return res.status(403).json({ fail: "You are not authorized to delete this user" });
  }

  const { username, project } = user;

  if (project) {
    await Project.findByIdAndUpdate(project, { $pull: { members: id } });
  }

  await User.findByIdAndDelete(id);
  res.json({ removed: `${username} removed` });
};

const adminDeleteUserById = async (req, res) => {
  const { id } = req.params;
  
  if (id === req.user._id) {
    return res.status(403).send({ fail: "You are not allowed to delete yourself" });
  }

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).send({ noUser: `User with id ${id} not found` });
    }

    const { username, project } = user;

    if (project) {
      await Project.findByIdAndUpdate(project, { $pull: { members: id } });
    }

    await User.findByIdAndDelete(id);

    res.status(200).send({ removed: `${username} removed` });

  } catch (error) {
    res.status(500).send({ error: "Server error" });
  }
};

const adminUpdateUserDetails = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(404).send({ fail: "Wrong type of id" });
  }

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).send({ fail: "No user found" });
    }

    const { name, password, email, username, userType } = req.body;
    const encrypted = await bcrypt.hash(password, 10);

    const updatedUser = await User.findByIdAndUpdate(id, {
      name,
      password: encrypted,
      email,
      username,
      userType,
    });

    res.send(updatedUser);

  } catch (error) {
    res.status(500).send({ error: "Server error" });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.send(user);

  } catch (error) {
    res.status(500).send({ error: "Server error" });
  }
};

const searchUsers = async (req, res) => {
  const nameQuery = req.query.name || "";

  try {
    const users = await User.find({ name: { $regex: nameQuery, $options: "i" } });
    res.send(users);

  } catch (error) {
    res.status(500).send({ error: "Server error" });
  }
};

module.exports = {
  getAllUsers,
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
