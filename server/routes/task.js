const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');


//create,find,update,delete
router.get('/', taskController.view);





module.exports = router;
