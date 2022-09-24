const router = require('express').Router(); 
const arduinoController = require('../control/ArduinoStream')

router.post('/',arduinoController.CommandHandler)

module.exports = router;