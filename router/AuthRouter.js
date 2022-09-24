const router = require('express').Router(); 

const authcontroller = require('../control/Auth');



router.post('/register',authcontroller.RegisterUser);
router.post('/login', authcontroller.Login); 
router.post('/logout',authcontroller.Logout);
module.exports = router;