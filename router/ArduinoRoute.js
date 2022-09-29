const router = require('express').Router(); 
const arduinoController = require('../control/ArduinoStream')

router.post('/:id',arduinoController.CommandRequest)

module.exports = router;