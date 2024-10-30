const express = require('express');
const User = require('../models/user');
const Purchase = require('../models/purchase'); // Import the Purchase model
const router = express.Router();

// User Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    // Find the user by username and password
    const user = await User.findOne({ where: { username, password } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Return the user object, including balance
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        balance: user.balance // Include balance here
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User Registration (Sign Up)
router.post('/signup', async (req, res) => {
  const { username, password, role } = req.body;
  try {
    // Check if username already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    // Create new user
    const newUser = await User.create({ username, password, role, balance: 0 }); // Initialize balance to 0
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ error: error.message });
  }
});


// Get user details (for balance)
router.get('/user/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user); // Return the full user object, including balance
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add balance to user account
router.post('/user/:id/add-balance', async (req, res) => {
  const { id: user_id } = req.params;
  try {
    const user = await User.findByPk(user_id); // Retrieve the user by their ID
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.balance += 1000; // Increment the user's balance by 1000 euros
    await user.save(); // Save the updated balance to the database
    res.json(user); // Return the updated user object
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all purchased seminars for a user
router.get('/user/:id/purchases', async (req, res) => {
  const { id: user_id } = req.params;
  try {
    const purchases = await Purchase.findAll({ where: { user_id } });
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
