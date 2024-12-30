const socket = io();
const loginScreen = document.getElementById('login-screen');
const chatScreen = document.getElementById('chat-screen');
const usernameInput = document.getElementById('username');
const loginBtn = document.getElementById('login-btn');
const chatBox = document.getElementById('chat-box');
const messageInput = document.getElementById('message');
const sendBtn = document.getElementById('send-btn');

let username = null;

function saveChatToLocalStorage(messages) {
  localStorage.setItem('chatMessages', JSON.stringify(messages));
}

function getChatFromLocalStorage() {
  return JSON.parse(localStorage.getItem('chatMessages')) || [];
}

function renderMessages(messages) {
  chatBox.innerHTML = '';
  messages.forEach(msg => {
    const div = document.createElement('div');
    div.classList.add('chat-message');
    div.innerHTML = `<strong>${msg.username}:</strong> ${msg.text} <span class="time">(${msg.time})</span>`;
    chatBox.appendChild(div);
  });
}

loginBtn.addEventListener('click', () => {
  username = usernameInput.value.trim();
  if (username) {
    loginScreen.classList.add('d-none');
    chatScreen.classList.remove('d-none');
    // Render existing local storage messages
    const messages = getChatFromLocalStorage();
    renderMessages(messages);
  }
});

sendBtn.addEventListener('click', () => {
  sendMessage();
});

// Listen for Enter key press to send message
messageInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault(); // Prevent the default Enter behavior (like new line in textarea)
    sendMessage();
  }
});

// Function to send the message
function sendMessage() {
  const message = messageInput.value.trim();
  if (message) {
    const time = new Date().toLocaleTimeString();
    const msgData = { username, text: message, time };
    // Emit the message to the server
    socket.emit('chatMessage', msgData);
    messageInput.value = '';
  }
}

// Handle chat history received from the server
socket.on('chatHistory', messages => {
  // Render the history and save to local storage
  renderMessages(messages);
  saveChatToLocalStorage(messages);
});

// Handle new chat messages
socket.on('chatMessage', msgData => {
  const messages = getChatFromLocalStorage();
  messages.push(msgData);
  saveChatToLocalStorage(messages);
  renderMessages(messages);
});
