const router = require('express').Router();
const streamController = require('../control/StreamControl')
router.get('/:id', streamController.getAllStream);
router.post('/:id/average',streamController.getDataInRange)
module.exports = router;