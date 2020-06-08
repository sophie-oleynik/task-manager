const mongoose = require('mongoose');

const List = mongoose.model('List', new mongoose.Schema({
    title: { 
        type: String,
        required: true,
        maxlength: 50
    },
    description: { 
        type: String,
        maxlength: 2048
    },
    tasks: [{
        taskId: {
            type: mongoose.Schema.Types.ObjectId
        }
    }],
}));

exports.List = List;