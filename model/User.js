const mongoose = require('mongoose');

const { Schema, model } = mongoose;


const userSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    isAdmin: {
        type: String,
        default: false
    },
    command_excuted: [{
        commandLog: String,

    }]
})

const Users = model('Users', userSchema);
module.exports = Users;