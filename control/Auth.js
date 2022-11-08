const Users = require('../model/User')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SALT_ROUNDS = process.env.SALT_ROUND || 10;
const wrapAsync = require('../utils/wrapAsync')

const jsonWebTokenPrivateKey = process.env.JWT_PRIVATE_KEY || "6bjhds67dbfd9r36teofbe9364583beu"

module.exports.RegisterUser = wrapAsync(async function (req, res) {

    const availableUser = await Users.find();
    if (availableUser.length == 0) {
        const data = req.body;
        if (!(data.firstname && data.lastname && data.username && data.confirmpassword && data.password && data.email)) {
            const msg = {
                msg: "All inputs are required",
                status: 401
            };
            return res.json(msg);
        }

        if (data.password !== data.confirmpassword) {
            const msg = {
                msg: "Passwords dont match",
                status: 401
            }
            return res.json(msg)
        }
        const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
        const insertedData = { first_name: data.firstname, last_name: data.lastname, username: data.username, email: data.email, password: hashedPassword, isAdmin: true }
        const alldata = new Users(insertedData);
        await alldata.save();
        const token = jwt.sign({"login_token":alldata._id},jsonWebTokenPrivateKey);
        req.session.token = token
        console.log(req.session)
        return res.json({
            msg:"Registered Successfully",
            token: token,
            status: 200
        })
   
    } else {
        return res.json({
            msg: "Cant Register more than one admin",
            status: 401
        })
    }
})

module.exports.Login = wrapAsync(async function (req, res) {
    const allusers = await Users.find()
    if (allusers.length) {
        const data = req.body.values;
        console.log(data)
        if (!(data.username && data.password)) {
            const msg = {
                msg: "username or password cannot be empty",
                status: 401
            };
            return res.json(msg);
        }

        const userdata = await Users.findOne({ username: data.username });
        if(!userdata){
            return res.json({
                msg:"No such user", 
                status:401
            })
        }
        const decryptedPasswordResult = await bcrypt.compare(data.password, userdata.password);
        if (decryptedPasswordResult) {
            const token = jwt.sign({ "login_token": userdata._id }, jsonWebTokenPrivateKey)
            req.session.token = token;
            req.session.user = userdata;
            req.session.commands = []
            req.cookies.commands = []
            return res.json({
                token: token,
                msg: "Login Successful",
                status: 200
            })
        } else {
            return res.json({
                msg: "incorrect email or password",
                status: 401
            })
        }
    } else {
        return res.json({
            msg: "No user Available! You have to register first",
            status: 200
        })
    }
})

module.exports.Logout = wrapAsync(function (req, res) {
    req.session.token = null;
    return res.json({
        msg: "Logged out successfully",
        status: 200
    })

})


