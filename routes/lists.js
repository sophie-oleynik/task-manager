const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const controller = require('../controllers/list-controller.js');

router.post('/', auth, controller.newList);
router.get('/:id', controller.getList);
router.put('/:id', controller.updateList);
router.delete('/:id', controller.deleteList);

module.exports = router;