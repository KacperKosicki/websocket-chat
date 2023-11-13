// app.js

let userName = '';
const loginForm = document.getElementById('welcome-form');
const messagesSection = document.querySelector('.messages-section');
const messagesList = document.getElementById('messages-list');
const addMessageForm = document.getElementById('add-messages-form');
const userNameInput = document.getElementById('username');
const messageContentInput = document.getElementById('message-content');

const socket = io();

function addMessage(author, content) {
  const message = document.createElement('li');
  message.classList.add('message');
  message.classList.add('message--received');
  if (author === userName) message.classList.add('message--self');
  message.innerHTML = `
    <h3 class="message__author">${userName === author ? 'You' : author}</h3>
    <div class="message__content">
      ${content}
    </div>
  `;
  messagesList.appendChild(message);
}

function login(event) {
  event.preventDefault();

  if (!userNameInput.value.trim()) {
    alert('Please enter your name.');
    return;
  }

  userName = userNameInput.value.trim();

  loginForm.classList.remove('show');
  messagesSection.classList.add('show');

  socket.emit('join', userName);
}

function sendMessage(event) {
  event.preventDefault();

  const messageContent = messageContentInput.value.trim();
  if (!messageContent) {
    alert('Please enter a message.');
    return;
  }

  addMessage(userName, messageContent);

  socket.emit('message', { author: userName, content: messageContent });

  messageContentInput.value = '';
}

loginForm.addEventListener('submit', login);
addMessageForm.addEventListener('submit', sendMessage);

socket.on('message', ({ author, content }) => addMessage(author, content));
socket.on('newUser', (user) => addMessage('Chat Bot', `${user.name} has joined the conversation!`));
socket.on('removeUser', (user) => addMessage('Chat Bot', `${user.name} has left the conversation... :(`));