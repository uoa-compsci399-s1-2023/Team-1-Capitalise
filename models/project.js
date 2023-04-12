const Joi = require('joi');
const mongoose = require('mongoose');
const { userSchema } = require('./user');
const { commentSchema } = require('./comment');
const { tagSchema } = require('./tag');
const { parameterSchema } = require('./parameter');

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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parameter',
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parameter'
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
          banner: {
            type: String
          },
          gallery: [{
            type: String
          }],
          text: {
            type: String
          },
          video: {
            type: String
          },
          poster: {
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
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  badges: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parameter'
  },
  tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag'
  }],
});

const Project = mongoose.model('Project', projectSchema);

function validateProject(project) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(100).required(),
    teamname: Joi.string(),
    semester: Joi.string().min(7).max(7).required(),
    userId: Joi.array().items(Joi.objectId()),
    repoLink: Joi.string(),
    members: Joi.array().items(Joi.objectId()),
    content: Joi.array().items(Joi.object({
      tab: Joi.array().items(Joi.object({
        Banner: Joi.string(),
        Gallery: Joi.array().items(Joi.string()),
        text: Joi.string(),
        video: Joi.string(),
        poster: Joi.string()
      })).required()
    })),
    badges: Joi.string().valid('CommunityImpact', 'TopExcellence', 'PeoplesChoice'),
    category: Joi.string().valid('Mobile Development', 'Game Development', 'Web Development').required(),
    tags: Joi.array().items(Joi.string())
  });

  return schema.validate(project);
}

exports.Project = Project;
exports.validate = validateProject;