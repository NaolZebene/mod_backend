const express = require('express');
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
const { isLoggedIn } = require('../utils/isLoggedIn')

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


const wrap = middleware => (socket, next) => middleware(socket.request, {}, next)
io.use(wrap(sessionMiddleWare))

io.use((socket, next) => {
    var session = socket.request.session;
    next();
})



mongoose.connect("mongodb://localhost/modOz", { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("Connected To Database Successfully")
}).catch((e) => {
    console.log("Error While Connecting to Database");
})


//routes
const transformerRouter = require('./router/TransformerRoute');
const authRouter = require('./router/AuthRouter');
const scheduleRouter = require('./router/ScheduleRoute');
// const arduinoRouter = require('./router/ArduinoRoute')(io);
const userRouter = require('./router/UserRoute');
const streamRouter = require('./router/stream_datas');
const commandLogRouter = require('./router/commandLogRouter');


app.use('/schedule', scheduleRouter)
app.use('/transformer', transformerRouter);
app.use('/', authRouter);
// app.use('/', arduinoRouter)
app.use('/users', userRouter);
app.use('/stream', streamRouter);
app.use('/commandlog', commandLogRouter);



app.use(function (req, res, next) {

    res.locals.commands = []
    next();
})



app.get('/', isLoggedIn, function (req, res) {
    res.render("testFile")
})

app.get('/login', function (req, res) {
    res.render('login');
})


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