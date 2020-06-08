const mongoose = require('mongoose');
const Joi = require('joi');

const Task = mongoose.model('Task', new mongoose.Schema({
    text: { 
        type: String,
        required: true,
        minlength: 5,
        maxlength: 2048
    },
    creationDate: { 
        type: Date,
        required: true
    },
    dueDate: {
        type: Date,
        required: false
    },
    priority: {
        type: Number,
        default: 0,
        required: false
    },
    isCompleted: {
        type: Boolean,
        required: true
    },
    endDate: { 
        type: Date,
        required: false
    }
}));

function validateTask(task) {
    const schema = {
        text: Joi.string().min(5).max(2048).required(),
        creationDate: Joi.date().required(),
        dueDate: Joi.date(),
        priority: Joi.number().default(0),
        isCompleted: Joi.boolean().required(),
        endDate: Joi.date(),
    };
    return Joi.validate(task, schema);
}

exports.Task = Task;
exports.validate = validateTask;