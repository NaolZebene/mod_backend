const express = require('express');
const PORT = process.env.PORT || 5000;
var socketio = require('socket.io');

const app = express()

const expressServer = app.listen(PORT, function () {
    console.log(`Listening on port ${PORT}`)
})

const io = socketio(expressServer, {
    cors: {
        origin: "*"
    }
});
module.exports = {
    io,
    expressServer,
    app
}