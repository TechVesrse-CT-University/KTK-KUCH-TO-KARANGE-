const express = require('express');
const { getRooms } = require('../socket');
const logger = require('../utils/logger');

const router = express.Router();

// Get messages for a specific room
router.get('/:roomId', (req, res) => {
  try {
    const { roomId } = req.params;
    
    if (!roomId) {
      return res.status(400).json({
        success: false,
        message: 'Room ID is required'
      });
    }
    
    // Get room data
    const roomData = getRooms.get(roomId);
    
    if (!roomData) {
      return res.status(404).json({
        success: false,
        message: `Room "${roomId}" not found`
      });
    }
    
    // Return messages for the room
    res.status(200).json({
      success: true,
      messages: roomData.messages || [],
      roomName: roomData.name
    });
    
  } catch (err) {
    logger.error('Error retrieving messages', err);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve messages'
    });
  }
});

// Get list of available rooms
router.get('/', (req, res) => {
  try {
    const roomList = [];
    
    getRooms.forEach((data, id) => {
      roomList.push({
        id,
        name: data.name,
        messageCount: data.messages ? data.messages.length : 0
      });
    });
    
    res.status(200).json({
      success: true,
      rooms: roomList
    });
    
  } catch (err) {
    logger.error('Error retrieving rooms', err);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve rooms'
    });
  }
});

module.exports = router;
