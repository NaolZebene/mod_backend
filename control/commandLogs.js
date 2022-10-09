const commandLogs = require('../model/commandLogs');
const User = require('../model/User')
const wrapAsync = require('../utils/wrapAsync')
const mongoose = require('mongoose')


module.exports.viewAllCommandLogs = wrapAsync(async function (req, res) {
    all_result = [];
    all_user_sent = []

    const all_command_logs = await commandLogs.find();
    for (let i = 0; i < all_command_logs.length; i++) {
        user_sent = await User.findById(mongoose.Types.ObjectId(all_command_logs[i].userSent));
        let all_payload = {
            command: all_command_logs[i].command,
            command_status: all_command_logs[i].command_status,
            timeStamp: all_command_logs[i].timeStamp,
            userSent: user_sent.username
        }

        all_result.push(all_payload)
    }

    return res.json({
        payload: all_result,
        status: 200
    })
})