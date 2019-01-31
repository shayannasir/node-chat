const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const { generateMessage } = require('./utils/message');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', socket => {
  console.log('new user connected');

  socket.emit(
    'newMessage',
    generateMessage('Admin', 'Welcopme to the chat app')
  );

  // socket.broadcast = emits to all except the generator
  socket.broadcast.emit(
    'newMessage',
    generateMessage('Admin', 'New User Joined')
  );

  // socket.emit = Event generator, emits to a single person
  socket.on('createMessage', message => {
    console.log('Message Created', message);

    // io.emit = emits to every connection
    io.emit('newMessage', generateMessage(message.from, message.text));
  });

  // socket.on = Event Listener
  socket.on('disconnect', () => {
    console.log('User was disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
