const {Project, validate} = require('../models/project');
const {User} = require('../models/user');
const {List} = require('../models/list');
const _ = require('lodash');

let controller = {
    getProjects: async (req, res) => {
        let user = await User.findById(req.user._id);
        let projects = []
        for (const key in user.projects) {
            if (user.projects.hasOwnProperty(key)) {
                const id = user.projects[key]._id;
                let project = await Project.findById(id);
                if(project) projects.push(project);
            }
        }
        res.send(projects)
    },
    inviteUser: async (req, res) => {
        if(req.params.id) {
            let project = await Project.findById(req.params.id);
            let user = await User.findOne({ email: req.body.email });
            if (!user) return res.status(400).send('User not found.');
            user.projects.push(project._id);
            project.users.push(user._id);
            await user.save();
            await project.save();
            res.send(project)
        } else {
            res.status(400).send("Id is not provided")
        }
        
    },
    getProjectLists: async (req, res) => {
        if(req.params.id) {
            let project = await Project.findById(req.params.id);
            let lists = []
            if(project && project.list) {
                for (const index in project.list) {
                    if (project.list.hasOwnProperty(index)) {
                        const element = project.list[index];
                        let list = await List.findById(element.listId)
                        if(list) lists.push({id: list._id, title: list.title, description: list.description})
                    }
                }
            }
            res.send(lists)
        } else {
            res.status(400).send("Id is not provided")
        }
        
    },
    addProjectList: async (req, res) => {
        if(req.params.id) {
            let list = new List(_.pick(req.body, ['title', 'description']));
            list.tasks = []
            let project = await Project.findById(req.params.id)
            try {
                project.list.push({listId: list._id});
                await project.save();
                await list.save();
                res.send(list);
            } catch (error) {
                res.status(500).send(error.message)
            }
        } else {
            res.status(500).send("No project id provided")
        }
        
    },
    newProject: async (req, res) => {
        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        let project = await Project.findOne({ title: req.body.title });
        if (project) return res.status(400).send('The project with this title already exists.');

        project = new Project(_.pick(req.body, ['title']));
        
        let user = await User.findById(req.user._id);
        project.users.push(user._id);
        await project.save();
        user.projects.push(project._id);
        await user.save();

        res.send(project);
    },
    updateProject: async (req, res) => {
        if(req.params.id) {
            let project = await Project.findById(req.params.id);
		    const newProject = _.pick(req.body, ['title', 'list']);
		    project.title = newProject.title || project.title;
		    project.list = newProject.list || project.list;
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