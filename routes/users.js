const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const controller = require('../controllers/user-controller.js');

router.get('/me', auth, controller.getUser); 
router.post('/', controller.newUser);
router.post('/auth', controller.authUser);
router.get('/me', auth, controller.getUsers); 

module.exports = router;