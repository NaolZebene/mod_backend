const serialport = require('serialport');
const SerialPort = serialport.SerialPort; 
const {ReadlineParser} = require('@serialport/parser-readline')
const port = "COM11";
process.setMaxListeners(0);
var myport = new SerialPort({
    baudRate:9600, 
    path:port
})

var parser = myport.pipe(new ReadlineParser({delimiter:'\r\n'}))



module.exports.CommandHandler = async function(req,res){
    let command = req.body.command
    console.log(command); 
    all_commands = command.split(' ')
    let command_length = all_commands.length; 
    console.log(all_commands.length)
    if(command_length > 0){
        if(command_length == 1){
            if(all_commands[0] == "ping"){
                myport.write("ping\n")
                Stream()
            }else if(all_commands[0] =="startup"){
                myport.write("startup\n")
                Stream()
            }else if(all_commands[0] == "shutdown"){
                myport.write("shutdown\n")
                Stream()
            }
        }
        else if(command_length == 2){
            if(all_commands[0] == "bcast"){
                let command_sent = `bcast ${all_commands}\n`
                myport.write(command_sent);
                Stream()
            }else if(all_commands[0]=="config"){
                if(all_commands[1] == "-v"){
                    let command_sent = `config ${all_commands[1]}\n`; 
                    myport.write(command_sent);
                    Stream()
                }else{
                    console.log(`Invalid Option ${all_commands[1]}`);
                }
            }
        }
        else if(command_length == 4){
          
            if(all_commands[0] == "config"){
                if(all_commands[1] == "-u"){
                     if(all_commands[2] =="Tmin"){
                        let command_sent = `${all_commands[0]} ${all_commands[1]} ${all_commands[2]} ${all_commands[3]}\n`
                        myport.write(command_sent);
                        Stream()
                     }else if(all_commands[2] =="Tmax"){
                        let command_sent = `${all_commands[0]} ${all_commands[1]} ${all_commands[2]} ${all_commands[3]}\n`
                        myport.write(command_sent);
                        Stream()
                     }else if(all_commands[2] =="Tsh"){
                        let command_sent = `${all_commands[0]} ${all_commands[1]} ${all_commands[2]} ${all_commands[3]}\n`
                        myport.write(command_sent);
                        Stream()
                     }else if(all_commands[2] =="Vmin"){
                        let command_sent = `${all_commands[0]} ${all_commands[1]} ${all_commands[2]} ${all_commands[3]}\n`
                        myport.write(command_sent);
                        Stream()
                     }else if(all_commands[2] =="Vmax"){
                        let command_sent = `${all_commands[0]} ${all_commands[1]} ${all_commands[2]} ${all_commands[3]}\n`
                        myport.write(command_sent);
                        Stream()
                     }else if(all_commands[2] =="Vsh"){
                        let command_sent = `${all_commands[0]} ${all_commands[1]} ${all_commands[2]} ${all_commands[3]}\n`
                        myport.write(command_sent);
                        Stream()
                     }else if(all_commands[2] =="Cmin"){
                        let command_sent = `${all_commands[0]} ${all_commands[1]} ${all_commands[2]} ${all_commands[3]}\n`
                        myport.write(command_sent);
                        Stream()
                     }else if(all_commands[2] =="Cmax"){
                        let command_sent = `${all_commands[0]} ${all_commands[1]} ${all_commands[2]} ${all_commands[3]}\n`
                        myport.write(command_sent);
                        Stream()
                     }else if(all_commands[2] =="Csh"){
                        let command_sent = `${all_commands[0]} ${all_commands[1]} ${all_commands[2]} ${all_commands[3]}\n`
                        myport.write(command_sent);
                        Stream()
                     }else if(all_commands[2] =="Hmin"){
                        let command_sent = `${all_commands[0]} ${all_commands[1]} ${all_commands[2]} ${all_commands[3]}\n`
                        myport.write(command_sent);
                        Stream()
                     }else if(all_commands[2] =="Hmax"){
                        let command_sent = `${all_commands[0]} ${all_commands[1]} ${all_commands[2]} ${all_commands[3]}\n`
                        myport.write(command_sent);
                        Stream()
                     }else if(all_commands[2] =="Hsh"){
                        let command_sent = `${all_commands[0]} ${all_commands[1]} ${all_commands[2]} ${all_commands[3]}\n`
                        myport.write(command_sent);
                        Stream()
                     }else if(all_commands[2] =="Omim"){
                        let command_sent = `${all_commands[0]} ${all_commands[1]} ${all_commands[2]} ${all_commands[3]}\n`
                        myport.write(command_sent);
                        Stream()
                     }else if(all_commands[2] =="Omax"){
                        let command_sent = `${all_commands[0]} ${all_commands[1]} ${all_commands[2]} ${all_commands[3]}\n`
                        myport.write(command_sent);
                        Stream()
                     }else if(all_commands[2] =="Osh"){
                        let command_sent = `${all_commands[0]} ${all_commands[1]} ${all_commands[2]} ${all_commands[3]}\n`
                        myport.write(command_sent);
                        Stream()
                     }else{
                        console.log(`Invalid parameter ${all_commands[2]}`)
                     }
            }else{
                console.log(`Invalid Option ${all_commands[1]}`)
            }
        }
        
       

    } else if(command_length == 5){
       
        if(all_commands[0] == "stream"){
            if(all_commands[1] == "-a"){
                if(all_commands[2] == "s"){
                    let command_sent = `${all_commands[0]} ${all_commands[1]} ${all_commands[2]} ${all_commands[3]} ${all_commands[4]}\n`
                    myport.write(command_sent); 
                    Stream()
                }else{
                    console.log("No such parameter");
                }
            }else {
                console.log("No such option")
            }
        }else{
            console.log(`No such Command ${all_commands[0]}`)
        }
    }
    else{
        console.log("No such command")
    }

}


}

function Stream(){
    
        
    // myport.write(command)
    parser.on('data',async function(data){
        console.log(data);
    })
    
}