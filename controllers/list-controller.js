const {List} = require('../models/list');
const {User} = require('../models/user');
const {Task} = require('../models/task');
const _ = require('lodash');

let controller = {
    getLists: async (req, res) => {
        let user = await User.findById(req.user._id);
        let lists = []
        for (const index in user.list) {
            if (user.list.hasOwnProperty(index)) {
                const element = user.list[index];
                let list = await List.findById(element.id)
                if(list) lists.push({id: list._id, title: list.title, description: list.description})
            }
        }
        res.send(lists)
    },
    getListTasks: async (req, res) => {
        let list = await List.findById(req.body.listId)
        let taskList = []
        if(list) {
            for (const taskIndex in list.tasks) {
                if (list.tasks.hasOwnProperty(taskIndex)) {
                    const taskId = list.tasks[taskIndex];
                    let task = await Task.findById(taskId);
                    if(task) {
                        taskList.push(task)
                    }
                }
            }
        }
        res.send({id: req.body.listId, tasks: taskList})
    },
    getList: async (req, res) => {
        if(req.params.id) {
            let list = await List.findById(req.params.id);
            res.send(list);
        } else {
            res.status(500).send('The list with the given ID was not found.')
        }
    },
    newList: async (req, res) => {
        let list = new List(_.pick(req.body, ['title', 'description']));
        list.tasks = []
        let user = await User.findById(req.user._id)
        try {
            user.list.push(list._id);
            await user.save();
            await list.save();
            res.send(list);
        } catch (error) {
            res.status(500).send(error.message)
        }
    },
    updateList: async (req, res) => {
        if(req.params.id) {
            let list = await List.findById(req.params.id);
		    const newList = _.pick(req.body, ['title', 'description']);
		    list.title = newList.title || list.title;
		    list.description = newList.description || list.description;
		    list.save()
			    .then(result => { res.send(result) });
        } else {
            res.status(500).send('The list with the given ID was not found.');
        }
    },
    deleteList: async (req, res) => {
        if(req.params.id) {
            let list = await List.findByIdAndDelete(req.params.id);
            if(!list) return res.send({ message: 'The list was not found.' });
            return res.send({ message: 'The list was deleted successfully', list });
        } else {
            res.status(500).send('The list with the given ID was not found.')
        }
    }
}

module.exports = controller;