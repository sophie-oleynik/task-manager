const mongoose = require('mongoose');
const Joi = require('joi');

const Project = mongoose.model('Project', new mongoose.Schema({
    title: { 
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    list: [{
        listId: {
            type: mongoose.Schema.Types.ObjectId
        }
    }],
    users: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId
        }
    }]
}));

function validateProject(project) {
    const schema = {
        title: Joi.string().min(5).max(50).required(),
    };
    return Joi.validate(project, schema);
}

exports.Project = Project;
exports.validate = validateProject;