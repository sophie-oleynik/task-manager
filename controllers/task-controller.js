const _ = require('lodash');
const {Task, validate} = require('../models/task');
const {List} = require('../models/list');
const {User} = require('../models/user');

let controller = {
    getTask: async (req, res) => {
        if(req.params.id) {
            let task = await Task.findById(req.params.id);
            res.send(task);
        } else {
            res.status(500).send('The task with the given ID was not found.')
        }
    },
    getTasksForDate: async (req, res) => {
        let user = await User.findById(req.user._id);
        let lists = []

        for (const index in user.list) {
            if (user.list.hasOwnProperty(index)) {
                const element = user.list[index];
                let list = await List.findById(element.id)
                if(list) {
                    let taskList = []
                    for (const taskIndex in list.tasks) {
                        if (list.tasks.hasOwnProperty(taskIndex)) {
                            const taskId = list.tasks[taskIndex];
                            let task = await Task.findById(taskId);
                            if(task && new Date(task.dueDate).toLocaleDateString().slice(0, 10) === new Date(req.body.time).toLocaleDateString().slice(0, 10)) {
                                taskList.push(task)
                            }
                        }
                    }
                    lists.push({ name: list.title, tasks: taskList})
                }
            }
        }
        res.send(lists)
    },
    newTask: async (req, res) => {
        let listId = req.body.listId;
        delete req.body.listId
        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        task = new Task(_.pick(req.body, ['text', 'creationDate', 'dueDate', 'priority', 'isCompleted','endDate' ]));
        await task.save();
        let list = await List.findById(listId)
        list.tasks.push(task._id)
        await list.save();
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