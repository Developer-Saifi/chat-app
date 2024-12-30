const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname)));

// Store chat history in memory
let chatHistory = [];

io.on('connection', (socket) => {
  console.log('A user connected');

  // Send chat history to the newly connected user
  socket.emit('chatHistory', chatHistory);

  socket.on('chatMessage', (msgData) => {
    // Add new message to chat history
    chatHistory.push(msgData);

    // Limit chat history to the last 100 messages
    if (chatHistory.length > 100) {
      chatHistory.shift();
    }

    // Broadcast the new message to all users
    io.emit('chatMessage', msgData);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
