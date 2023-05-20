const Joi = require('joi');
const mongoose = require('mongoose');
Joi.objectId = require("joi-objectid")(Joi);

const parameterSchema = new mongoose.Schema({
    value: {
        type: String,
        minlength: 1,
        maxlength: 50,
        required: true
    },
    parameterType: {
        type: String,
        required: true,
        enum: ['category', 'semester', 'award', 'sortBy']
    },
    runnerUp: {
        type: Boolean
    },
    image: {
        type: String
    },
    gradient: [{
        type: String
    }]
});


const Parameter = mongoose.model('Parameter', parameterSchema);

function validateParameter(Parameter) {
    const schema = Joi.object({
        value: Joi.string().min(1).max(50).required(),
        parameterType: Joi.string().valid('category', 'semester', 'award', 'sortBy').required(),
        runnerUp: Joi.boolean(),
        image: Joi.string(),
        gradient: Joi.array().items(Joi.string()),
    });

    return schema.validate(Parameter);
}

exports.parameterSchema = parameterSchema;
exports.Parameter = Parameter;
exports.validateParameter = validateParameter;