const router = require('express').Router();
const streamController = require('../control/StreamControl')
router.get('/:id', streamController.getAllStream);
router.get('/:id/average', streamController.getDataInRange);
router.post('/:id/temperature', streamController.getWeeklyTemperatureAverage);
module.exports = router;