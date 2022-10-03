const wrapAsync = require('../utils/wrapAsync');
const { CommandHandler } = require('../utils/commandHandler');
const commandLog = require('../model/commandLogs');
const Users = require('../model/User')
const { io } = require('../server')

// const fs = require('fs');
var fs = require('fs');

module.exports.CommandRequest = (async function (req, res) {
   const { id } = req.params;
   const command = req.body.command;
   console.log(command)
   // try {
   //    io.on('connection', (socket) => {
   //       console.log("socket communication established");
   //    })

   // } catch (err) {
   //    console.log(err)
   // }
   // CommandHandler(command, id, req, res);

})