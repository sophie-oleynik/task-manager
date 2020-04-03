const {Project, validate} = require('../models/project');
const _ = require('lodash');

let controller = {
    getProject: async (req, res) => {
        if(req.params.id) {
            let project = await Project.findById(req.params.id);
            res.send(project);
        } else {
            res.status(500).send('The project with the given ID was not found.')
        }
    },
    newProject: async (req, res) => {
        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        let project = await Project.findOne({ title: req.body.title });
        if (project) return res.status(400).send('The project with this title already exists.');

        project = new Project(_.pick(req.body, ['title']));

        await project.save();
        res.send(project);
    },
    updateProject: async (req, res) => {
        if(req.params.id) {
            let project = await Project.findById(req.params.id);
		    console.log(req.params.id);
		    const newProject = _.pick(req.body, ['title', 'list', 'users']);
		    project.title = newProject.title || project.title;
		    project.list = newProject.list || project.list;
		    project.users = newProject.users || project.users;
		    project.save()
			    .then(result => { res.send(result) });
        } else {
            res.status(500).send('The project with the given ID was not found.');
            const { error } = validate(req.body);
            if (error) return res.status(400).send(error.details[0].message);
        }
    },
    deleteProject: async (req, res) => {
        if(req.params.id) {
            let project = await Project.findByIdAndDelete(req.params.id);
            if(!project) return res.send({ message: 'The project was not found.' });
            return res.send({ message: 'The project was deleted successfully', project });
        } else {
            res.status(500).send('The project with the given ID was not found.')
        }
    }
}

module.exports = controller;