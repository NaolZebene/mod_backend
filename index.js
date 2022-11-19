// const dotenv = require('dotenv')
// dotenv.config();

const express = require('express');
const cors = require('cors')
// const app = express();
const app = require('./server').app
// const PORT = process.env.PORT || 3000;
const path = require('path')
const mongoose = require('mongoose');
const session = require('express-session');
const ExpressError = require('./utils/ExpressError');
const cookieParser = require('cookie-parser');
const ejs = require('ejs')
// var socketio = require('socket.io');
// const express_Server = require('./server').expressServer
const io = require('./server').io
const { CommandHandler } = require('./utils/commandHandler')
const { isLoggedIn } = require('./utils/isLoggedIn')
const allmodels = require('./model/models')

//middle wares
const sessionConfig = {
    secret: "secret",
    resave: false,
    saveUninitialized: true,
}
const sessionMiddleWare = session(sessionConfig)

app.set('view engine', 'ejs');
app.path('/views', path.join(__dirname, 'views'))

app.use(sessionMiddleWare)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '/files')));
app.use(cookieParser());
app.use(cors())

const wrap = middleware => (socket, next) => middleware(socket.request, {}, next)
io.use(wrap(sessionMiddleWare))

io.use((socket, next) => {
    var session = socket.request.session;
    next();
})

const MONGO_URI = "mongodb+srv://oz_mod:mod_oz@cluster0.pqmq1ww.mongodb.net/mod_oz?retryWrites=true&w=majority" || "mongodb://localhost/modOz"

mongoose.connect(`${MONGO_URI}`, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("Connected To Database Successfully")
}).catch((e) => {
    console.log("Error While Connecting to Database");
    console.log(e)
})


//routes
const transformerRouter = require('./router/TransformerRoute');
const authRouter = require('./router/AuthRouter');
const scheduleRouter = require('./router/ScheduleRoute');
const arduinoRouter = require('./router/ArduinoRoute')(io);
const userRouter = require('./router/UserRoute');
const streamRouter = require('./router/stream_datas');
const commandLogRouter = require('./router/commandLogRouter');
const { response } = require('express');


app.use('/schedule', scheduleRouter)
app.use('/transformer', transformerRouter);
app.use('/', authRouter);
app.use('/arduino', arduinoRouter);
app.use('/users', userRouter);
app.use('/stream', streamRouter);
app.use('/commandlog', commandLogRouter);



app.use(function (req, res, next) {

    res.locals.commands = []
    next();
})



app.get('/', isLoggedIn, function (req, res) {
    // res.render("testFile")
    res.send("OZORO BACKEND API")
})

app.get('/login', function (req, res) {
    res.render('index');
})



// app.get('/sendcommand', (req, res) => {
//     res.render("testFile")
// })


app.get('/sendcommand', async (req, res) => {
    let data = {
        msg: "Use /sendcommand to send as a POST and /recievedata to get commands as a POST ",
        status: 2000
    }

    return res.json(data)


})

app.post('/sendcommand', async (req, res) => {
    const command = req.body;
    const all_commands = command.command.split(' ');
    const command_length = all_commands.length;

    if (command_length > 0) {
        if (command_length == 2) {

            if (all_commands[0] == "ping" || all_commands[0] == "shutdown" || all_commands[0] == "startup") {
                const data_exists = await allmodels.ListingTable.findOne({ transformer_id: all_commands[1] });
                if (!data_exists) {
                    return res.json("Wrong Transformer id");
                }
                let commandData = {
                    Command: all_commands[0]
                }
                await mongoose.connection.db.collection(data_exists.command_to_write).insertOne(commandData);
            }

        }
    }
    console.log("DONE")
})

app.post('/recievedata', async (req, res) => {
    const data = req.body;
    const all_data = data.data.split("#")
    for (let response of all_data) {
        let newres = response.split(',')
        const data_exists = await allmodels.ListingTable.findOne({ transformer_id: mongoose.Types.ObjectId(newres[3]) });
        if (!data_exists) {
            return res.json({
                msg: "Wrong transformer id"
            });

        }

        const command_model = await mongoose.connection.db.collection(data_exists.command_to_write)
        const command_exits = await command_model.findOne({ _id: mongoose.Types.ObjectId(newres[0]) })

        if (!command_exits) {
            return res.json({ msg: "Wrong command id" })
        }

        let inserted_data = {
            Command: command_exits.command,
            command_status: newres[2],
            response: newres[1]
        }

        await mongoose.connection.db.collection(data_exists.command_to_read).insertOne(inserted_data);
        await mongoose.connection.db.collection(data_exists.command_to_write).remove({ _id: mongoose.Types.ObjectId(newres[0]) });

    }
})

app.get('/getcommand/:id', async (req, res) => {

    const { id } = req.params;
    const all_collection = await allmodels.ListingTable.findOne({ transformer_id: id });

    if (!all_collection) {
        return res.send(404);
    }

    const all_commands = await mongoose.connection.db.collection(all_collection.command_to_write).find().toArray();
    let command_sent = [];
    for (let command of all_commands) {
        let new_command = [String(command._id), command.Command];
        command_sent.push(new_command);
    }

    res.send(command_sent)

})





// async function ListenToDatabaseChange(pipeline = []) {
//     const collection_datas = await allmodels.ListingTable.find();
//     console.log(collection_datas)
//     for (let data of collection_datas) {
//         const collection = mongoose.connection.db.collection(data.command_to_read)
//         const changeStream = collection.watch(pipeline);

//         changeStream.on('change', (next) => {
//             console.log(next)
//         })
//     }

// }

// ListenToDatabaseChange().then((res) => {
//     console.log(res)
// }).catch(function (er) {
//     console.log(er)
// })





app.use("*", function (req, res, next) {
    next(new ExpressError("Page Not Found", 404));
});


app.use(function (err, req, res, next) {
    const { statusCode = 500 } = err;
    if (!err.message) {
        err.message = "Someting Went Wrong";
    }

    res.json({
        msg: err,
        status: statusCode
    })
});







// io.on('connection', (socket) => {
//     console.log("socket connected index", socket.id);
//     var session = socket.request.session;

//     // console.log("inside io id", id)
//     socket.on('message', (data) => {
//         // console.log(data)
//         // socket.emit('message', "this is from the server")

//         CommandHandler({ id: "633c14f2916b6e5b314a9ff2", socket: socket, session: session, command: data })

//     })


// })




// const express_Server = app.listen(PORT, function (req, res) {
//     console.log(`Listening on port ${PORT}`);
// })


// const io = socketio(express_Server);

// module.exports = {
//     io
// }