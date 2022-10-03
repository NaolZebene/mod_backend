const wrapAsync = require('../utils/wrapAsync');
const User = require('../model/User');
const SALT_ROUNDS = process.env.SALT_ROUND || 10;
const bcrypt = require('bcrypt')

module.exports.AddUser = wrapAsync(async function (req, res) {
    const { isAdmin } = req.session.user;
    const UserInfo = req.body;
    if (!isAdmin) {
        return res.json({
            payload: "You must be an admin to perform this operation",
            status: 401
        })
    }

    if (!(UserInfo.firstname && UserInfo.lastname && UserInfo.username && UserInfo.confirmpassword && UserInfo.password)) {
        const msg = {
            msg: "All inputs are required",
            status: 401
        };
        return res.json(msg);
    }


    const username_exists = await User.findOne({ username: UserInfo.username });
    if (username_exists) {
        return res.json({
            payload: "Username Exists",
            status: 200
        })
    }

    if (UserInfo.password !== UserInfo.confirmpassword) {
        const msg = {
            msg: "Passwords dont match",
            status: 401
        }
        return res.json(msg)
    }

    const hashedPassword = await bcrypt.hash(UserInfo.password, SALT_ROUNDS);



    const userData = {
        first_name: UserInfo.username,
        last_name: UserInfo.lastname,
        username: UserInfo.username,
        email: UserInfo.email,
        password: hashedPassword,
        isAdmin: false
    }

    const new_user = new User(userData);
    await new_user.save()

    return res.json({
        payload: "Created a User Successfully",
        status: 200
    })


})

module.exports.deleteUser = wrapAsync(async function (req, res) {
    const { isAdmin } = req.session.user;
    if (!isAdmin) {
        return res.json({
            payload: "You must be an admin to perform this operation",
            status: 401
        })
    }
    const { id } = req.params;
    const userExists = User.findOne({ _id: id })
    if (!userExists) {
        return res.json({
            payload: "User dont exist",
            status: 200
        })
    }

    await User.findByIdAndDelete(id);
    return res.json({
        payload: "User removed Successfully",
        status: 200
    })

})

