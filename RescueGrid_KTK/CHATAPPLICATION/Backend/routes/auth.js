const express = require('express');
const jwt = require('jsonwebtoken');
const userDb = require('../data/users');
const logger = require('../utils/logger');

const router = express.Router();

// Environment variables with fallbacks
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-for-jwt-signing';
const TOKEN_EXPIRY = process.env.TOKEN_EXPIRY || '24h';

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Log login attempt (without password)
    logger.auth('Login attempt', { email, ip: req.ip });
    
    // Input validation
    if (!email || !password) {
      logger.auth('Login failed - Missing credentials', { email });
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }
    
    // Find user by email
    const user = userDb.findByEmail(email);
    
    // Check if user exists
    if (!user) {
      logger.auth('Login failed - User not found', { email });
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }
    
    // Validate password
    const isValidPassword = await userDb.validatePassword(user, password);
    
    if (!isValidPassword) {
      logger.auth('Login failed - Invalid password', { email });
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }
    
    // Create token payload (without sensitive data)
    const tokenPayload = {
      id: user.email,
      username: user.username,
      role: user.role
    };
    
    // Generate JWT
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
    
    // Log successful login
    logger.auth('Login successful', { email, username: user.username });
    
    // Return success with token and user info
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        email: user.email,
        username: user.username,
        role: user.role
      }
    });
    
  } catch (err) {
    logger.error('Login error', err);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Register route with automatic user creation
router.post('/register', async (req, res) => {
  try {
    const { email, username, password } = req.body;
    
    // Log registration attempt (without password)
    logger.auth('Registration attempt', { email, username });
    
    // Basic validation
    if (!email || !username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email, username and password are required' 
      });
    }
    
    // Check if user already exists
    const existingUser = userDb.findByEmail(email);
    if (existingUser) {
      logger.auth('Registration failed - Email already exists', { email });
      return res.status(409).json({ 
        success: false, 
        message: 'An account with this email already exists' 
      });
    }
    
    // Create new user directly (for demo purposes)
    try {
      // For this demo, create the user and return login credentials
      await userDb.createUser(email, username, password);
      
      // Create token payload
      const tokenPayload = {
        id: email,
        username: username,
        role: 'user'
      };
      
      // Generate JWT
      const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
      
      // Log successful registration and auto-login
      logger.auth('Registration successful with auto-login', { email, username });
      
      // Return success with token and user info for auto-login
      res.status(201).json({
        success: true,
        message: 'Registration successful.',
        token,
        user: {
          email,
          username,
          role: 'user'
        }
      });
    } catch (err) {
      logger.error('Error creating user', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to create user account'
      });
    }
  } catch (err) {
    logger.error('Registration error', err);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Token verification route
router.get('/verify', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided' 
      });
    }
    
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid token' 
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'Token valid',
        user: decoded
      });
    });
  } catch (err) {
    logger.error('Token verification error', err);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

module.exports = router;
