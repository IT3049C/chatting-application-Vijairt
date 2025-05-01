// ==== References ====
const nameInput = document.getElementById("my-name-input");
const messageInput = document.getElementById("my-message");
const sendButton = document.getElementById("send-button");
const chatBox = document.getElementById("chat");

const MILLISECONDS_IN_TEN_SECONDS = 10000;
const SERVER_URL = "https://it3049c-chat.fly.dev/messages";

// ==== Format a message object into HTML ====
function formatMessage(message) {
    const isMine = message.sender === nameInput.value;
    const messageClass = isMine ? "mine" : "yours";
    const time = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return `
        <div class="${messageClass} messages">
            <div class="message">${message.text}</div>
            ${!isMine ? `<div class="sender-info">${message.sender} ${time}</div>` : ""}
        </div>
    `;
}

// ==== Fetch messages from server ====
async function fetchMessages() {
    try {
        const response = await fetch(SERVER_URL);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching messages:", error);
        return [];
    }
}

// ==== Update the chatbox with messages ====
async function updateMessages() {
    const messages = await fetchMessages();
    chatBox.innerHTML = messages.map(formatMessage).join('');
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll
}

// ==== Send a message to server ====
async function sendMessage(username, text) {
    const message = {
        sender: username,
        text: text,
        timestamp: Date.now()
    };

    try {
        await fetch(SERVER_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(message)
        });

        updateMessages(); // Refresh chat
    } catch (error) {
        console.error("Error sending message:", error);
    }
}

// ==== Event Listener on Send button ====
sendButton.addEventListener("click", () => {
    const username = nameInput.value.trim();
    const text = messageInput.value.trim();

    if (username && text) {
        sendMessage(username, text);
        messageInput.value = "";
    }
});

// ==== Initial load and periodic refresh ====
updateMessages();
setInterval(updateMessages, MILLISECONDS_IN_TEN_SECONDS);
