const auth = require('../middleware/auth');
const {List, validate} = require('../models/list');
const express = require('express');
const router = express.Router();
const controller = require('../controllers/list-controller.js')

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let list = await List.findOne({ title: req.body.title });
    if (list) return res.status(400).send('List with this title already exists.');

    list = new List(req.body, ['title', 'description']);
    await list.save();
    res.send(list);
});

router.get('/:id', controller.getList);

module.exports = router;