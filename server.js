const express = require('express');
const path = require('path');

const app = express();
const port = 8000;

app.use(express.static(path.join(__dirname, 'client')));

const messages = [];

app.get('/messages', (req, res) => {
  res.json(messages);
});

app.post('/messages', express.json(), (req, res) => {
  const newMessage = req.body;
  messages.push(newMessage);
  res.status(201).json(newMessage);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});