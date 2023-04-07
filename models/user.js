const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const { commentSchema } = require('./comment');
Joi.objectId = require("joi-objectid")(Joi);

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  github: {
    type: String
  },
  linkedin: {
    type: String
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  bio: {
    type: String,
    maxLength: 2000
  },
  likedProjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }],
  myComments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],

  userType: {
    type: String,
    enum: ['visitor', 'graduate', 'admin'],
    default: 'visitor',
    required: true
  }

});

//Create a method for the userSchema which generates the authentication token. The token will store the _id, username and userType of a user. 
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({
    _id: this._id,
    username: this.username,
    userType: this.userType
  }, process.env.JWT_PRIVATE_KEY);
  return token;
}

const User = mongoose.model('User', userSchema);

function validateUser(User) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(3).max(50).required(),
    username: Joi.string().min(3).required(),
    password: Joi.string().min(3).required(),
    github: Joi.string(),
    linkedin: Joi.string(),
    projectId: Joi.objectId(),
    bio: Joi.string().max(2000),
    likedProjects: Joi.array(),
    myComments: Joi.array(),
    userType: Joi.string().valid('visitor', 'graduate')
  });

  return schema.validate(User);
}

exports.userSchema = userSchema;
exports.User = User;
exports.validate = validateUser;