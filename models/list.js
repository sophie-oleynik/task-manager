const mongoose = require('mongoose');
const Joi = require('joi');

const List = mongoose.model('List', new mongoose.Schema({
    title: { 
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    description: { 
        type: String,
        required: false,
        minlength: 5,
        maxlength: 2048
    },
    tasks: [{
        tasks: {
            type: mongoose.Schema.Types.ObjectId
        }
    }],
}));

function validateList(list) {
    const schema = {
        title: Joi.string().min(5).max(50).required(),
        description: Joi.string().min(5).max(2048).required(),
    };
    return Joi.validate(list, schema);
}

exports.List = List;
exports.validate = validateList;