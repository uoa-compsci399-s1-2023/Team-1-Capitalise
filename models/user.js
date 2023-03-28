const Joi = require('joi');
const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50
    },
    email: {
        type: String,
        required: true
    },
    username: {
      type: String,
      required: true
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
      type: new mongoose.Schema({
        projectName: {
            type: String,
            minlength: 5,
            maxlength: 50
          }
    })
    },
    bio: {
      type: String
    },
    likedProjects: [{
      type: new mongoose.Schema({
        projectName: {
            type: String,
            required: true,
            minlength: 5,
            maxlength: 50
          }
    })
    }],
    myComments: [{
      type: new mongoose.Schema({
        projectName: {
            type: String,
            required: true,
            minlength: 5,
            maxlength: 50
          },
        comment: {
          type: String,
          required: true
        }
    })
    }],
    admin: {
      type: Boolean,
      required: true
    }

  });

const User = mongoose.model('User', userSchema);

function validateUser(User) {
    const schema = Joi.object({
      name: Joi.string().min(3).required(),
      email: Joi.string().min(3).required(),
      username: Joi.string().min(3).required(),
      password: Joi.string().min(3).required(),
      github: Joi.string(),
      linkedin: Joi.string(),
      projectId: Joi.objectId(),
      bio: Joi.string(),
      likedProjects: Joi.array(),
      myComments: Joi.array(),
      admin: Joi.boolean().required()
    });
  
    return schema.validate(User);
  }

exports.userSchema = userSchema;
exports.User = User; 
exports.validate = validateUser;