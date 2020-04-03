const _ = require('lodash');
const {Task, validate} = require('../models/task');

let controller = {
    getTask: async (req, res) => {
        if(req.params.id) {
            let task = await Task.findById(req.params.id);
            res.send(task);
        } else {
            res.status(500).send('The task with the given ID was not found.')
        }
    },
    newTask: async (req, res) => {
        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        let task = await Task.findOne({ text: req.body.text });
        if (task) return res.status(400).send('This task already exists.');

        task = new Task(_.pick(req.body, ['text', 'creationDate', 'dueDate', 'priority', 'isCompleted','endDate' ]));
        await task.save();
        res.send(task);
    },
    updateTask: async (req, res) => {
        if(req.params.id) {
            let task = await Task.findById(req.params.id);
		    console.log(req.params.id);
		    const newTask = _.pick(req.body, ['text', 'dueDate', 'priority', 'isCompleted','endDate']);
		    task.text = newTask.text || task.text;
		    task.priority = newTask.priority || task.priority;
		    task.dueDate = newTask.dueDate || task.dueDate;
		    task.isCompleted = newTask.isCompleted || task.isCompleted;
		    task.endDate = newTask.endDate || task.endDate;
		    task.save()
			    .then(result => { res.send(result) });
        } else {
            res.status(500).send('The task with the given ID was not found.');
            const { error } = validate(req.body);
            if (error) return res.status(400).send(error.details[0].message);
        }
    },
    deleteTask: async (req, res) => {
        if(req.params.id) {
            let task = await Task.findByIdAndDelete(req.params.id);
            if(!task) return res.send({ message: 'The task was not found.' });
            return res.send({ message: 'The task was deleted successfully', task });
        } else {
            res.status(500).send('The task with the given ID was not found.')
        }
    }
}

module.exports = controller;