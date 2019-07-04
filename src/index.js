const path = require('path');
const http = require('http');
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words');

const app = express()
const server = http.createServer(app);
//Create a new socket.io instance passing server
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

//Event Acknowledgements: 
// server (emit) -> client (receive) --acknowledgement --> server
// client (emit) -> server (receive) --acknowledgement --> client

io.on('connection', (socket) => {
    console.log('New Web Socket Connection');
    //Sending to the Single Client
    socket.emit('message', 'Welcome!!!', (message) => {
        console.log(message)
    
    });

    //1. Have server emit "locationMessage" with the URL
    socket.emit('locationMessage')

    //broadcasts means sending a message to everyone else except for the socket it starts with.
    socket.broadcast.emit('message', 'A new user has joined!');
   
    socket.on('sendMessage', (message, callback) => {
       const filter = new Filter()

       if (filter.isProfane(message)) {
            return callback('Profanity is not allowed!')
       }
        //Sends to all connected clients
        io.emit('message', message);
        //acknowledge the event
        callback();
    })
   
    socket.on('sendLocation', (coords, callback) => {
        io.emit('message', `https://google.com/maps?q=${coords.latitude},${coords.longitude}`);
        //2. Setup the server to send back the acknowledgment
        //3. Have the client print "Location shared! when acknowledged"
        callback()
    })

    socket.on('disconnect', () => {
        io.emit('message', 'A user has left!');
    });
    //acknowledge the event
    
})

server.listen(port, () => console.log(`Example app listening on port ${port}!`))
