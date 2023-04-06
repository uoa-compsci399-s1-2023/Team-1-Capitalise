const Joi = require('joi');
const mongoose = require('mongoose');
const { userSchema } = require('./user');

Joi.objectId = require("joi-objectid")(Joi);

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 100
  },
  teamname: {
    type: String
  },
  semester: {
    type: String,
    required: true
  },
  repoLink: {
    type: String
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  content: [{
    type: new mongoose.Schema({
      _id: false,
      tab: [{
        type: new mongoose.Schema({
          _id: false,
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
      _id: false,
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      userComment: {
        type: String,
        minlength: 1,
        maxlength: 500
      }
    })
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
    name: Joi.string().min(5).max(100).required(),
    team: Joi.string(),
    semester: Joi.string().min(7).max(7).required(),
    userId: Joi.array().items(Joi.objectId()),
    repoLink: Joi.string(),
    members: Joi.array().items(Joi.objectId()),
    content: Joi.array().items(Joi.object({
      tab: Joi.array().items(Joi.object({
        photo: Joi.string(),
        photoGallery: Joi.array().items(Joi.string()),
        text: Joi.string(),
        video: Joi.string()
      })).required()
    })),
    badges: Joi.string().valid('clientWinner', 'clientRunner', 'peopleWinner', 'peopleRunner'),
    tags: Joi.array().items(Joi.string())
  });

  return schema.validate(project);
}

exports.Project = Project;
exports.validate = validateProject;