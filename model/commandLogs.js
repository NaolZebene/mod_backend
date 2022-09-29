const mongoose = require('mongoose'); 
const {model,Schema} = mongoose; 

const commandLogSchema = new Schema({
    command:{
        type:String
    }, 
    command_status:{
            type:String
    }, 
    timeStamp:{
        type:String, 

    }
})

const commandLogs = model('commandLogs',commandLogSchema);

module.exports = commandLogs;