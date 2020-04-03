const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const controller = require('../controllers/project-controller.js');

router.post('/', auth, controller.newProject);
router.get('/:id', controller.getProject);
router.put('/:id', controller.updateProject);
router.delete('/:id', controller.deleteProject);

module.exports = router;