const router = require('express').Router();

const UserController = require('../control/Users');
const { isLoggedIn } = require('../utils/isLoggedIn');

router.post('/', isLoggedIn, UserController.AddUser);
router.delete('/:id', isLoggedIn, UserController.deleteUser);

module.exports = router;