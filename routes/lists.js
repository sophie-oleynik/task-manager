const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const controller = require('../controllers/list-controller.js');

router.post('/', auth, controller.newList);
router.get('/', auth, controller.getLists);
router.post('/tasklist', auth, controller.getListTasks)
router.get('/:id', auth, controller.getList);
router.put('/:id', auth, controller.updateList);
router.delete('/:id', auth, controller.deleteList);

module.exports = router;