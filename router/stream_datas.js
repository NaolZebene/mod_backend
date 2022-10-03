const router = require('express').Router();
const streamController = require('../control/StreamControl')
router.get('/:id', streamController.getAllStream);

module.exports = router;