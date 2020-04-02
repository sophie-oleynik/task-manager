const auth = require('../middleware/auth');
const {Project, validate} = require('../models/project');
const express = require('express');
const router = express.Router();

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let project = await Project.findOne({ title: req.body.title });
    if (project) return res.status(400).send('Project with this title already exists.');

    project = new Project(req.body, ['title']);

    await project.save();
    res.send(project);
});

module.exports = router;