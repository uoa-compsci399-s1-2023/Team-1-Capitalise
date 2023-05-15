const Joi = require('joi');
const mongoose = require('mongoose');
Joi.objectId = require("joi-objectid")(Joi);

const tagSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 1,
        maxlength: 50,
        required: true
    },
    projects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    }],
    mentions: {
        type: Number,
        required: true
    }

});


const Tag = mongoose.model('Tag', tagSchema);

function validateTag(Tag) {
    const schema = Joi.object({
        projectId: Joi.objectId(),
        name: Joi.string().min(1).max(20).required()
    });

    return schema.validate(Tag);
}

exports.tagSchema = tagSchema;
exports.Tag = Tag;
exports.validateTag = validateTag;