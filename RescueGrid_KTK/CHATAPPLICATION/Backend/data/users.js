const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');

// In-memory user database for demo purposes
// In production, this would be a real database
const users = new Map();

// Create hashed password for test user
const createTestUser = async () => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    // Add test user with email from error message
    users.set('madhavarora132005@gmail.com', {
      email: 'madhavarora132005@gmail.com',
      username: 'madhav',
      password: hashedPassword,
      role: 'user',
      createdAt: new Date(),
    });
    
    // Add another test user
    users.set('test@example.com', {
      email: 'test@example.com',
      username: 'testuser',
      password: hashedPassword,
      role: 'user',
      createdAt: new Date(),
    });
    
    logger.info('Test users created successfully');
  } catch (err) {
    logger.error('Failed to create test users', err);
  }
};

// Initialize test users
createTestUser();

// User data access methods
const userDb = {
  findByEmail: (email) => {
    return users.get(email) || null;
  },
  
  findByUsername: (username) => {
    let foundUser = null;
    users.forEach((user) => {
      if (user.username === username) {
        foundUser = user;
      }
    });
    return foundUser;
  },
  
  validatePassword: async (user, password) => {
    if (!user || !password) return false;
    try {
      return await bcrypt.compare(password, user.password);
    } catch (err) {
      logger.error('Password validation error', err);
      return false;
    }
  },
  
  // Add createUser method
  createUser: async (email, username, password) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      users.set(email, {
        email,
        username,
        password: hashedPassword,
        role: 'user',
        createdAt: new Date()
      });
      
      logger.info('User created successfully', { email, username });
      return true;
    } catch (err) {
      logger.error('User creation error', err);
      throw err;
    }
  }
};

module.exports = userDb;
