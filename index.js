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

//middle wares
const sessionConfig = {
    secret: "secret",
    resave: false,
    saveUninitialized: true,
}

app.set('view engine', 'ejs');
app.path('/views', path.join(__dirname, 'views'))

app.use(session(sessionConfig))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '/files')));
app.use(cookieParser());



mongoose.connect("mongodb://localhost/modOz", { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("Connected To Database Successfully")
}).catch((e) => {
    console.log("Error While Connecting to Database");
})


//routes
const transformerRouter = require('./router/TransformerRoute');
const authRouter = require('./router/AuthRouter');
const scheduleRouter = require('./router/ScheduleRoute');
const arduinoRouter = require('./router/ArduinoRoute')
const userRouter = require('./router/UserRoute');
const streamRouter = require('./router/stream_datas');

app.use('/schedule', scheduleRouter)
app.use('/transformer', transformerRouter);
app.use('/', authRouter);
app.use('/arduino', arduinoRouter)
app.use('/users', userRouter);
app.use('/stream', streamRouter);



app.use(function (req, res, next) {
    res.locals.commands = []
    next();
})



app.get('/', function (req, res) {
    res.render("testFile")
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


io.on('connection', (socket) => {
    console.log("socket connected index");
    io.on('message', (message) => {
        console.log(message)
    })

})




// const express_Server = app.listen(PORT, function (req, res) {
//     console.log(`Listening on port ${PORT}`);
// })


// const io = socketio(express_Server);

// module.exports = {
//     io
// }