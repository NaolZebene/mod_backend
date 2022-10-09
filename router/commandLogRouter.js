const router = require('express').Router();
const command_log_controller = require('../control/commandLogs');
const { isLoggedIn } = require('../utils/isLoggedIn')

router.post('/', isLoggedIn, command_log_controller.viewAllCommandLogs);


module.exports = router;