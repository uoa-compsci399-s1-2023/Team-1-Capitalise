const Joi = require('joi');
const mongoose = require('mongoose');
const {userSchema} = require('./user');

Joi.objectId = require("joi-objectid")(Joi);

const projectSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50
    },
    semester: {
        type: String,
        required: true
    },
    repoLink: {
      type: String
    }, 
    members: [{
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 50
              }
        }),
        required: true
    }],
    content: [{
      type: new mongoose.Schema({
          _id : false ,
          tab: [{
              type: new mongoose.Schema({
                _id : false ,
                photo: {
                  type: String
                },
                photoGallery: [{
                  type: String
                }],
                text: {
                  type: String
                },
                video: {
                  type: String
                }
              })
            }]
      }),
      required: true
  }],
  likes: {
    type: Number,
    required: true
  },
  comments: {
    type: new mongoose.Schema({
      _id : false ,
      userName: {
          type: String,
          required: true,
          minlength: 5,
          maxlength: 50
        }
      }),
      userComment: {
        type: String,
        minlength: 1,
        maxlength: 50
      }
    },
  badges: {
      type: String,
      enum: ['clientWinner', 'clientRunner', 'peopleWinner', 'peopleRunner'],
    },
  tags: {
    type: [String]
  }
  });

const Project = mongoose.model('Project', projectSchema);

function validateProject(project) {
    const schema = Joi.object({
      name: Joi.string().min(5).max(50).required(),
      semester: Joi.string().min(7).max(7).required(),
      userId: Joi.array().items(Joi.objectId()),
      repoLink: Joi.string(),
      members: Joi.array(),
      content: Joi.array(),
      comments: Joi.array(),
      badges: Joi.string(),
      tags: Joi.array().items(Joi.string())
    });
  
    return schema.validate(project);
  }
  
  exports.Project = Project; 
  exports.validate = validateProject;