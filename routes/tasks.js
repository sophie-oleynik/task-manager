const auth = require('../middleware/auth');
const {Task, validate} = require('../models/task');
const express = require('express');
const router = express.Router();

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let task = await Task.findOne({ text: req.body.text });
    if (task) return res.status(400).send('This task already exists.');

    task = new Task(req.body, ['text', 'creationDate', 'dueDate', 'priority', 'isCompleted','endDate' ]);
    await task.save();
    res.send(task);
});

module.exports = router;