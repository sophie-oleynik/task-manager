const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const controller = require('../controllers/task-controller.js');

router.post('/', auth, controller.newTask);
router.get('/:id', controller.getTask);
router.post('/tasksForDate', auth, controller.getTasksForDate);
router.put('/:id', controller.updateTask);
router.delete('/:id', controller.deleteTask);

module.exports = router;