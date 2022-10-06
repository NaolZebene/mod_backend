const router = require('express').Router();
const streamController = require('../control/StreamControl')
router.get('/:id', streamController.getAllStream);
router.post('/:id/average',streamController.getWeekAverage)
module.exports = router;