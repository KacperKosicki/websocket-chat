// server.js

const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const port = 8000;

app.use(express.static(path.join(__dirname, 'client')));

const messages = [];
const users = [];

app.get('/messages', (req, res) => {
  res.json(messages);
});

app.get('/users', (req, res) => {
  res.json(users);
});

app.post('/messages', express.json(), (req, res) => {
  const newMessage = req.body;
  messages.push(newMessage);
  res.status(201).json(newMessage);
});

app.post('/users', express.json(), (req, res) => {
  const newUser = req.body;
  users.push(newUser);
  io.emit('newUser', newUser);
  res.status(201).json(newUser);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

io.on('connection', (socket) => {
  console.log('New client! Its id – ' + socket.id);

  socket.on('message', (message) => {
    console.log('Oh, I\'ve got something from ' + socket.id);
    messages.push(message);
    socket.broadcast.emit('message', message);
  });

  socket.on('join', (userName) => {
    const user = { name: userName, id: socket.id };
    users.push(user);
    io.emit('newUser', user);
  });

  socket.on('disconnect', () => {
    const disconnectedUser = users.find(user => user.id === socket.id);
    if (disconnectedUser) {
      io.emit('removeUser', disconnectedUser);
      users.splice(users.indexOf(disconnectedUser), 1);
    }
    console.log('Oh, socket ' + socket.id + ' has left');
  });

  console.log('I\'ve added listeners on message, join, and disconnect events \n');
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});