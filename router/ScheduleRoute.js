const router = require('express').Router(); 
const scheduleControls = require('../control/Schedule')


router.get('/',scheduleControls.ViewAllSchedule)
router.post('/',scheduleControls.CreateSchedule); 
router.put('/:id', scheduleControls.EditSchedule); 
router.delete("/:id",scheduleControls.DeleteSchedule);

module.exports = router;