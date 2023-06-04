const Joi = require("joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const { commentSchema } = require("./comment");
Joi.objectId = require("joi-objectid")(Joi);

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    unique: true,
  },
  profilePicture: {
    type: String,
    default:
      "https://capitalise-projects30934-staging.s3.ap-southeast-2.amazonaws.com/capitaliseAssets/default_pfp.svg",
  },
  password: {
    type: String,
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
  },
  bio: {
    type: String,
    maxLength: 2000,
    default: ""
  },
  likedProjects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
  ],
  myComments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],

  userType: {
    type: String,
    enum: ["visitor", "graduate", "admin"],
    default: "visitor",
    required: true,
  },
  isGoogleCreated: {
    type: Boolean,
    required: true,
    default: false,
  },
  links: [
    {
      type: new mongoose.Schema({
        value: {
          type: String,
        },
        type: {
          type: String,
          enum: ["github", "linkedin", "deployedSite"],
        },
      }),
    },
  ],
  skills: [
    {
      type: String,
    },
  ],
  status: {
    type: String,
    enum: ["Pending", "Active"],
    default: "Pending",
  },
  confirmationCode: {
    type: String,
    unique: true
  },
  passwordResetToken: {
    type: String,
  },
  displayEmail: {
    type: String,
    default: ""
  }
});

//Create a method for the userSchema which generates the authentication token. The token will store the _id, username and userType of a user.
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      username: this.username,
      userType: this.userType,
    },
    process.env.JWT_PRIVATE_KEY,
    { expiresIn: "30d" }
  );
  return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(User) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(3).max(50).required(),
    profilePicture: Joi.string(),
    username: Joi.string().min(3),
    password: Joi.string().min(3).required(),
    projectId: Joi.objectId(),
    bio: Joi.string().max(2000),
    likedProjects: Joi.array(),
    myComments: Joi.array(),
    isGoogleCreated: Joi.boolean(),
    status: Joi.string().valid("Active", "Pending"),
    links: Joi.array().items(
      Joi.object({
        type: Joi.string()
          .valid("github", "linkedin", "deployedSite")
          .required(),
        value: Joi.string().required(),
      })
    ),
    skills: Joi.array().items(Joi.string()),
  });

  return schema.validate(User);
}

exports.userSchema = userSchema;
exports.User = User;
exports.validate = validateUser;