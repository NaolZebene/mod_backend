const express = require('express'); 
const app = express(); 
const PORT = process.env.PORT || 3000; 
const path = require('path')
const mongoose = require('mongoose'); 
const session = require('express-session');
const ExpressError = require('./utils/ExpressError'); 
const cookieParser = require('cookie-parser');

//middle wares
const sessionConfig = {
    secret: "secret",
    resave: false,
    saveUninitialized: true,
}

app.use(session(sessionConfig))
app.use(express.urlencoded({extended:true})); 
app.use(express.json());
app.use(express.static(path.join(__dirname,'/files')));
app.use(cookieParser());


mongoose.connect("mongodb://localhost/modOz", { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
    console.log("Connected To Database Successfully")
}).catch((e)=>{
    console.log("Error While Connecting to Database"); 
})


//routes
const transformerRouter = require('./router/TransformerRoute'); 
const authRouter = require('./router/AuthRouter');
const scheduleRouter = require('./router/ScheduleRoute');
const arduinoRouter = require('./router/ArduinoRoute')

app.use('/schedule',scheduleRouter)
app.use('/transformer', transformerRouter);
app.use('/', authRouter);
app.use('/arduino',arduinoRouter)

app.use(function(req,res,next){
    res.locals.commands = []
    next();
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

app.listen(PORT, function(req,res){
    console.log(`Listening on port ${PORT}`);
})
