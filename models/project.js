const Joi = require("joi");
const mongoose = require("mongoose");
const { userSchema } = require("./user");
const { commentSchema } = require("./comment");
const { tagSchema } = require("./tag");
const { parameterSchema } = require("./parameter");

Joi.objectId = require("joi-objectid")(Joi);

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 100,
    },
    teamname: {
      type: String,
    },
    blurb: {
      type: String,
    },
    views: {
      type: Number,
      default: 0,
    },
    semester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Parameter",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Parameter",
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
              "codesandbox",
              "deployedSite",
              "codepen",
              "notion",
              "kaggle",
            ],
          },
        }),
      },
    ],
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    banner: {
      type: String,
    },
    thumbnail: {
      type: String,
    },
    content: [
      {
        type: new mongoose.Schema({
          _id: false,
          tabName: {
            type: String,
          },
          tabContent: [
            {
              type: new mongoose.Schema({
                type: {
                  type: String,
                  enum: [
                    "gallery",
                    "poster",
                    "text",
                    "video",
                    "codeBlock",
                    "quote",
                    "image",
                  ],
                },
                subHeading: {
                  type: String,
                },
                value: [
                  {
                    type: String,
                  },
                ],
              }),
            },
          ],
        }),
        required: true,
      },
    ],
    likes: {
      type: Number,
      required: true,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    badges: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Parameter",
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);

function validateProject(project) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(100).required(),
    blurb: Joi.string(),
    teamname: Joi.string(),
    banner: Joi.string(),
    thumbnail: Joi.string(),
    semester: Joi.string().min(7).max(7).required(),
    userId: Joi.array().items(Joi.objectId()),
    links: Joi.array().items(
      Joi.object({
        type: Joi.string()
          .valid(
            "github",
            "codesandbox",
            "deployedSite",
            "codepen",
            "notion",
            "kaggle"
          )
          .required(),
        value: Joi.string().required(),
      })
    ),
    content: Joi.array().items(
      Joi.object({
        tabName: Joi.string().required(),
        tabContent: Joi.array().items(
          Joi.object({
            type: Joi.string()
              .valid(
                "gallery",
                "poster",
                "text",
                "video",
                "codeBlock",
                "quote",
                "image"
              )
              .required(),
            subHeading: Joi.string(),
            value: Joi.array().items(Joi.string()).required(),
          })
        ),
      })
    ),
    badges: Joi.string().valid(
      "Community Impact",
      "Top Excellence",
      "Peoples Choice"
    ),
    category: Joi.string()
      .valid("Mobile Development", "Game Development", "Web Development")
      .required(),
    tags: Joi.array().items(Joi.string()),
  });

  return schema.validate(project);
}

exports.Project = Project;
exports.validate = validateProject;
