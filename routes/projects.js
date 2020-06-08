const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const controller = require('../controllers/project-controller.js');

router.post('/', auth, controller.newProject);
router.get('/', auth, controller.getProjects);
router.get('/lists/:id', auth, controller.getProjectLists);
router.post('/:id/list', auth, controller.addProjectList);
router.post('/:id/invite', auth, controller.inviteUser);
router.put('/:id', auth, controller.updateProject);
router.delete('/:id', controller.deleteProject);

module.exports = router;