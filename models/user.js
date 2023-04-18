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
    type: String
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
    default: false
  },
  links: [
    {
      type: new mongoose.Schema({
        value: {
          type: String,
        },
        type: {
          type: String,
          enum: [
            "github",
            "linkedin",
            "deployedSite",
          ],
        },
      }),
    },
  ],
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
    { expiresIn: '30d' }
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
    links: Joi.array().items(
      Joi.object({
        type: Joi.string()
          .valid(
            "github",
            "linkedin",
            "deployedSite",
          )
          .required(),
        value: Joi.string().required(),
      })
    ),
  });

  return schema.validate(User);
}

exports.userSchema = userSchema;
exports.User = User;
exports.validate = validateUser;
