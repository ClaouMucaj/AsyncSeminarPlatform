// userRoutes.js
const express = require('express');
const router = express.Router();
const dataStore = require('../dataStore');

// Login: find user in the JSON file
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const users = dataStore.getUsers();
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }
  res.status(200).json({
    message: 'Login successful',
    user
  });
});

// Sign Up: create new user and store in JSON
router.post('/signup', (req, res) => {
  const { username, password, role } = req.body;
  let users = dataStore.getUsers();
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ error: 'Username already taken' });
  }
  const newUser = {
    id: Date.now(), // simple unique id
    username,
    password,
    role,
    balance: 0
  };
  users.push(newUser);
  dataStore.saveUsers(users);
  res.status(201).json({ message: 'User created successfully', user: newUser });
});

// Get user details
router.get('/user/:id', (req, res) => {
  const { id } = req.params;
  const users = dataStore.getUsers();
  const user = users.find(u => u.id == id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
});

// Add balance to user account
router.post('/user/:id/add-balance', (req, res) => {
  const { id } = req.params;
  let users = dataStore.getUsers();
  const user = users.find(u => u.id == id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  user.balance += 1000;
  dataStore.saveUsers(users);
  res.json(user);
});

// Get all purchased seminars for a user
router.get('/user/:id/purchases', (req, res) => {
  const { id } = req.params;
  const purchases = dataStore.getPurchases();
  const userPurchases = purchases.filter(p => p.user_id == id);
  res.json(userPurchases);
});

module.exports = router;
