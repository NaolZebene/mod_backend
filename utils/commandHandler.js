const serialport = require('serialport');
const commandLog = require('../model/commandLogs');
const SerialPort = serialport.SerialPort;
const { ReadlineParser } = require('@serialport/parser-readline')
const all_models = require('../model/models')
const port = "COM17";
const mongoose = require('mongoose');
const User = require('../model/User')
const io = require('../server').io
const wrapAsync = require('../utils/wrapAsync')
process.setMaxListeners(0);
var myport = new SerialPort({
    baudRate: 9600,
    path: port
})
const{request, response} = require('express')

var parser = myport.pipe(new ReadlineParser({ delimiter: '\r\n' }))

module.exports.CommandHandler = wrapAsync(async function ({id, socket,session,command}) {
    all_commands = command.split(' ')
    // console.log(command)
    // console.log("inside command hanlder", id)
    let command_length = all_commands.length;
    if (command_length > 0) {
        if (command_length == 1) {
            if (all_commands[0] == "ping") {
                myport.write("ping\n")
                Stream({code: 203, command: command, socket:socket,session:session});
            } else if (all_commands[0] == "startup") {
                myport.write("startup\n")
                Stream({code: 204, command: command,session:session , socket:socket});
            } else if (all_commands[0] == "shutdown") {
                myport.write("shutdown\n")
                Stream({ code: 204, command: command,session:session, socket:socket });
            }
        }
        else if (command_length == 2) {
            if (all_commands[0] == "bcast") {
                let command_sent = `bcast ${all_commands}\n`
                myport.write(command_sent);
                Stream({id});
            } else if (all_commands[0] == "config") {
                if (all_commands[1] == "-v") {
                    let command_sent = `config ${all_commands[1]}\n`;
                    myport.write(command_sent);
                    Stream({ code: 203, command: command,session:session, socket:socket });
                } else {
                    console.log(`Invalid Option ${all_commands[1]}`);
                }
            }
        }
        else if (command_length == 4) {

            if (all_commands[0] == "config") {
                if (all_commands[1] == "-u") {
                    if (all_commands[2] == "Tmin") {
                        let command_sent = `${all_commands[0]} ${all_commands[1]} ${all_commands[2]} ${all_commands[3]}\n`
                        myport.write(command_sent);
                        Stream({ id: id, code: 204, command: command,session:session, socket:socket });
                    } else if (all_commands[2] == "Tmax") {
                        let command_sent = `${all_commands[0]} ${all_commands[1]} ${all_commands[2]} ${all_commands[3]}\n`
                        myport.write(command_sent);
                           Stream({ id: id, code: 204, command: command,session:session, socket:socket });
                    } else if (all_commands[2] == "Tsh") {
                        let command_sent = `${all_commands[0]} ${all_commands[1]} ${all_commands[2]} ${all_commands[3]}\n`
                        myport.write(command_sent);
                           Stream({ id: id, code: 204, command: command,session:session, socket:socket });
                    } else if (all_commands[2] == "Vmin") {
                        let command_sent = `${all_commands[0]} ${all_commands[1]} ${all_commands[2]} ${all_commands[3]}\n`
                        myport.write(command_sent);
                           Stream({ id: id, code: 204, command: command,session:session, socket:socket });
                    } else if (all_commands[2] == "Vmax") {
                        let command_sent = `${all_commands[0]} ${all_commands[1]} ${all_commands[2]} ${all_commands[3]}\n`
                        myport.write(command_sent);
                           Stream({ id: id, code: 204, command: command,session:session, socket:socket });
                    } else if (all_commands[2] == "Vsh") {
                        let command_sent = `${all_commands[0]} ${all_commands[1]} ${all_commands[2]} ${all_commands[3]}\n`
                        myport.write(command_sent);
                           Stream({ id: id, code: 204, command: command,session:session, socket:socket });
                    } else if (all_commands[2] == "Cmin") {
                        let command_sent = `${all_commands[0]} ${all_commands[1]} ${all_commands[2]} ${all_commands[3]}\n`
                        myport.write(command_sent);
                        Stream({ id: id, code: 204 });
                    } else if (all_commands[2] == "Cmax") {
                        let command_sent = `${all_commands[0]} ${all_commands[1]} ${all_commands[2]} ${all_commands[3]}\n`
                        myport.write(command_sent);
                           Stream({ id: id, code: 204, command: command,session:session, socket:socket });
                    } else if (all_commands[2] == "Csh") {
                        let command_sent = `${all_commands[0]} ${all_commands[1]} ${all_commands[2]} ${all_commands[3]}\n`
                        myport.write(command_sent);
                           Stream({ id: id, code: 204, command: command,session:session, socket:socket });
                    } else if (all_commands[2] == "Hmin") {
                        let command_sent = `${all_commands[0]} ${all_commands[1]} ${all_commands[2]} ${all_commands[3]}\n`
                        myport.write(command_sent);
                           Stream({ id: id, code: 204, command: command,session:session, socket:socket });
                    } else if (all_commands[2] == "Hmax") {
                        let command_sent = `${all_commands[0]} ${all_commands[1]} ${all_commands[2]} ${all_commands[3]}\n`
                        myport.write(command_sent);
                           Stream({ id: id, code: 204, command: command,session:session, socket:socket });
                    } else if (all_commands[2] == "Hsh") {
                        let command_sent = `${all_commands[0]} ${all_commands[1]} ${all_commands[2]} ${all_commands[3]}\n`
                        myport.write(command_sent);
                           Stream({ id: id, code: 204, command: command,session:session, socket:socket });
                    } else if (all_commands[2] == "Omim") {
                        let command_sent = `${all_commands[0]} ${all_commands[1]} ${all_commands[2]} ${all_commands[3]}\n`
                        myport.write(command_sent);
                           Stream({ id: id, code: 204, command: command,session:session, socket:socket });
                    } else if (all_commands[2] == "Omax") {
                        let command_sent = `${all_commands[0]} ${all_commands[1]} ${all_commands[2]} ${all_commands[3]}\n`
                        myport.write(command_sent);
                           Stream({ id: id, code: 204, command: command,session:session, socket:socket });
                    } else if (all_commands[2] == "Osh") {
                        let command_sent = `${all_commands[0]} ${all_commands[1]} ${all_commands[2]} ${all_commands[3]}\n`
                        myport.write(command_sent);
                           Stream({ id: id, code: 204, command: command,session:session, socket:socket });
                    } else {
                        console.log(`Invalid parameter ${all_commands[2]}`)
                    }
                } else {
                    console.log(`Invalid Option ${all_commands[1]}`)
                }
            }



        } else if (command_length == 5) {

            if (all_commands[0] == "stream") {
                if (all_commands[1] == "-a") {
                    if (all_commands[2] == "s") {
                        console.log("inside stream")
                        console.log("inside", id)
                        let command_sent = `${all_commands[0]} ${all_commands[1]} ${all_commands[2]} ${all_commands[3]} ${all_commands[4]}\n`
                        myport.write(command_sent);
                        Stream({ id: id, code: 200,command: command,session:session , socket:socket});
                    } else {
                        console.log("No such parameter");
                    }
                } else if (all_commands[1] == "-t") {
                    let command_sent = `${all_commands[0]} ${all_commands[1]} ${all_commands[2]} ${all_commands[3]} ${all_commands[4]}\n`
                    myport.write(command_sent)
                    Stream({ id: id, code: 201, tag: "Temperature", command: command,session:session, socket:socket })
                } else if (all_commands[1] == "-h") {
                    let command_sent = `${all_commands[0]} ${all_commands[1]} ${all_commands[2]} ${all_commands[3]} ${all_commands[4]}\n`
                    myport.write(command_sent)
                    Stream({ id: id, code: 201, tag: "Humudity", command: command ,session:session, socket:socket})
                } else if (all_commands[1] == "-v") {
                    let command_sent = `${all_commands[0]} ${all_commands[1]} ${all_commands[2]} ${all_commands[3]} ${all_commands[4]}\n`
                    myport.write(command_sent)
                    Stream({ id: id, code: 201, tag: "Volatage", command: command ,session:session, socket:socket})
                } else if (all_commands[1] == '-c') {
                    let command_sent = `${all_commands[0]} ${all_commands[1]} ${all_commands[2]} ${all_commands[3]} ${all_commands[4]}\n`
                    myport.write(command_sent)
                    Stream({ id: id, code: 201, tag: "Current", command: command ,session:session, socket:socket})
                } else if (all_commands[1] == "-o") {
                    let command_sent = `${all_commands[0]} ${all_commands[1]} ${all_commands[2]} ${all_commands[3]} ${all_commands[4]}\n`
                    myport.write(command_sent)
                    Stream({ id: id, code: 201, tag: "Oil", command: command,session:session, socket:socke })
                } else {
                    console.log("No such option")
                }
            } else {
                console.log(`No such Command ${all_commands[0]}`)
            }
        }
        else {
            console.log("No such command")
        }

    }


})

 function Stream({ id, code, tag, command,socket , session}) {


    if (code == 200) {
        new_data = []
        parser.on('data', async function (data) {
            // console.log(data)
            let stream = data.trim().split(' ')
            const stream_datas = [{
                Temperature: parseFloat(stream[0]),
                Humudity: parseFloat(stream[1]),
                Voltage: parseFloat(stream[2]),
                Current: parseFloat(stream[3]),
                Oil: parseFloat(stream[4]),
                Time: new Date().toJSON()
            }]
            const collection_id = await all_models.ListingTable.findOne({ transformer_id: id });
            // console.log("this is id",id)
            //   console.log(req.session);
            console.log(collection_id)
            const inserted_data = await mongoose.connection.db.collection(collection_id.streamed_data).insertMany(stream_datas, { ordered: true });
            // console.log(typeof(stream_datas))
            count = 0 ; 
            if(count == 0){
                const user = await User.findOne({ _id: session.user._id })
                const new_log = new commandLog({ command: command, command_status: 1, timeStamp: new Date().toJSON(), userSent: user._id })
                await new_log.save();
                user.command_excuted.push(new_log._id);
                await user.save();
                count++
            }
            console.log(inserted_data)
            socket.emit('message', stream_datas)
           

        })

        
         

    } else if (code == 201) {
        new_data = []
        parser.on('data', async function (data) {

            let stream = data.trim().split(' ')

            stream_datas = {}
            stream_datas[tag] = stream[0]
            stream_datas = [stream_datas]
            console.log(stream)
            const collection_id = await all_models.ListingTable.findOne({ transformer_id: id });
            const inserted_data = await mongoose.connection.db.collection(collection_id.streamed_data).insertMany(stream_datas, { ordered: true });
            // console.log(stream_datas)
            socket.emit('message',inserted_data)
        })
    } else if (code == 203) {
        parser.on('data', async function (data) {
            let stream = data;
            console.log(stream);
            // console.log(req.session)
            const user = await User.findOne({ _id: session.user._id });
            const new_log = new commandLog({
                command: command,
                command_status: 1,
                timeStamp: new Date().toJSON(),
                userSent: user._id
            })
            await new_log.save();
            user.command_excuted.push({ commandLog: new_log._id });
            await user.save();
            // console.log(request.session)
            socket.emit('message',stream)

            

        })
    } else if (code == 204) {

        parser.on('data', async function (data) {
            let stream = parseInt(data);
            console.log(stream)
            console.log("Updated Successfully");
            socket.emit('message', "Updated Successfully")
            const user = await User.findOne({ _id: session.user._id });
            const new_log = new commandLog({
                command: command,
                command_status: 1,
                timeStamp: new Date().toJSON(),
                userSent: user._id
            })
            await new_log.save();
            user.command_excuted.push({ commandLog: new_log._id });
            await user.save();

            // if (stream == 1) {
            //     console.log("Updated Successfully");
            //     socket.emit('message', "Updated Successfully")
            //     const user = await User.findOne({ _id: session.user._id });
            //     const new_log = new commandLog({
            //         command: command,
            //         command_status: 1,
            //         timeStamp: new Date().toJSON(),
            //         userSent: user._id
            //     })
            //     await new_log.save();
            //     user.command_excuted.push({ commandLog: new_log._id });
            //     await user.save();

            // } else {
            //     console.log("OOPS Something went wrong");
            //     socket.emit('message',"filed to update")
            //     const user = await User.findOne({ _id: session.user._id });
            //     const new_log = new commandLog({
            //         command: command,
            //         command_status: 0,
            //         timeStamp: new Date().toJSON(),
            //         userSent: user._id
            //     })
            //     await new_log.save();
            //     user.command_excuted.push({ commandLog: new_log._id });
            //     await user.save();
            // }
        })
    }

}

function checkArduino() {
    return 1;
}