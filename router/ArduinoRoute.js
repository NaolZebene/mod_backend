const router = require('express').Router();
const arduinoController = require('../control/ArduinoStream');
const { isLoggedIn } = require('../utils/isLoggedIn')
const io = require('../server').io
router.post('/:id', arduinoController.CommandRequest)

// io.on('connection', (socket) => {
//     console.log("connected socket")
// })

module.exports = router;