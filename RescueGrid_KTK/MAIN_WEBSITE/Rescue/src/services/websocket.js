// filepath: Frontend/src/services/websocket.js

const WebSocket = require('ws');

let socket;

export const connectWebSocket = (url) => {
    socket = new WebSocket(url);

    socket.onopen = () => {
        console.log('WebSocket connection established');
    };

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        // Handle incoming messages
        console.log('Message from server:', data);
    };

    socket.onclose = () => {
        console.log('WebSocket connection closed');
    };

    socket.onerror = (error) => {
        console.error('WebSocket error:', error);
    };
};

export const sendMessage = (message) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(message));
    } else {
        console.error('WebSocket is not open. Unable to send message.');
    }
};

export const disconnectWebSocket = () => {
    if (socket) {
        socket.close();
    }
};