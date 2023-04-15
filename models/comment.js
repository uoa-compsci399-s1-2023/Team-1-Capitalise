const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
Joi.objectId = require("joi-objectid")(Joi);

const commentSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    commentBody: {
        type: String,
        minlength: 1,
        maxlength: 500,
        required: true
    },
    parentComment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        default: null
    }
}, {timestamps: true});


const Comment = mongoose.model('Comment', commentSchema);

function validateComment(Comment) {
    const schema = Joi.object({
        projectId: Joi.objectId().required(),
        commentBody: Joi.string().required()
    });

    return schema.validate(Comment);
}

exports.commentSchema = commentSchema;
exports.Comment = Comment;
exports.validateComment = validateComment;