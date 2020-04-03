const {List, validate} = require('../models/list');
const _ = require('lodash');

let controller = {
    getList: async (req, res) => {
        if(req.params.id) {
            let list = await List.findById(req.params.id);
            res.send(list);
        } else {
            res.status(500).send('The list with the given ID was not found.')
        }
    },
    newList: async (req, res) => {
        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        let list = await List.findOne({ title: req.body.title });
        if (list) return res.status(400).send('The list with this title already exists.');

        list = new List(_.pick(req.body, ['title', 'description']));
        await list.save();
        res.send(list);
    },
    updateList: async (req, res) => {
        if(req.params.id) {
            let list = await List.findById(req.params.id);
		    console.log(req.params.id);
		    const newList = _.pick(req.body, ['title', 'description']);
		    list.title = newList.title || list.title;
		    list.description = newList.description || list.description;
		    list.save()
			    .then(result => { res.send(result) });
        } else {
            res.status(500).send('The list with the given ID was not found.');
            const { error } = validate(req.body);
            if (error) return res.status(400).send(error.details[0].message);
        }
    },
    deleteList: async (req, res) => {
        if(req.params.id) {
            let list = await List.findByIdAndDelete(req.params.id);
            if(!list) return res.send({ message: 'The list was not found.' });
            return res.send({ message: 'The list was deleted successfully', project });
        } else {
            res.status(500).send('The list with the given ID was not found.')
        }
    }
}

module.exports = controller;