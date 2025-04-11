// filepath: Frontend/src/utils/timeUtils.js

export const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
};

export const getCurrentTimestamp = () => {
    return Date.now();
};