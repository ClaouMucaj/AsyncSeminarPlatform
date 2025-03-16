// seminarRoutes.js
const express = require('express');
const multer = require('multer');
const router = express.Router();
const dataStore = require('../dataStore');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// Create a new seminar and store in JSON
router.post('/seminars', upload.single('preview_image'), (req, res) => {
  const { title, description, created_by, exercises, duration, difficulty, price } = req.body;
  const preview_image = req.file ? `/uploads/${req.file.filename}` : '/uploads/notfound.jpg';
  let seminars = dataStore.getSeminars();
  const newSeminar = {
    id: Date.now(),
    title,
    description,
    created_by,
    exercises: Number(exercises),
    duration: Number(duration),
    difficulty,
    price: Number(price),
    preview_image,
    rating: 0,
    rating_count: 0
  };
  seminars.push(newSeminar);
  dataStore.saveSeminars(seminars);
  res.status(201).json(newSeminar);
});

// Get all seminars from the JSON file
router.get('/seminars', (req, res) => {
  const seminars = dataStore.getSeminars();
  res.json(seminars);
});

// Purchase a seminar
router.post('/seminars/:id/buy', (req, res) => {
  const { user_id } = req.body;
  const seminar_id = req.params.id;
  
  let seminars = dataStore.getSeminars();
  let users = dataStore.getUsers();
  let purchases = dataStore.getPurchases();

  const seminar = seminars.find(s => s.id == seminar_id);
  if (!seminar) {
    return res.status(404).json({ error: 'Seminar not found' });
  }

  const user = users.find(u => u.id == user_id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  if (user.balance < seminar.price) {
    return res.status(400).json({ error: 'Insufficient balance' });
  }
  if (purchases.find(p => p.user_id == user_id && p.seminar_id == seminar.id)) {
    return res.status(400).json({ error: 'Seminar already purchased' });
  }

  // Create new purchase record
  const purchase = {
    id: Date.now(),
    user_id,
    seminar_id: seminar.id,
    completed: false,
    rating: null
  };
  purchases.push(purchase);

  // Deduct the seminar price from the user's balance
  user.balance -= seminar.price;

  dataStore.savePurchases(purchases);
  dataStore.saveUsers(users);

  res.json({ message: 'Seminar purchased successfully' });
});

// Mark seminar as complete
router.post('/seminars/:id/complete', (req, res) => {
  const { user_id } = req.body;
  const seminar_id = req.params.id;
  let purchases = dataStore.getPurchases();
  const purchase = purchases.find(p => p.user_id == user_id && p.seminar_id == seminar_id);
  if (!purchase) return res.status(400).json({ error: 'Seminar not purchased' });
  purchase.completed = true;
  dataStore.savePurchases(purchases);
  res.json({ message: 'Seminar marked as complete' });
});

// Rate a seminar and update its average rating
router.post('/seminars/:id/rate', (req, res) => {
  const { rating, user_id } = req.body;
  const seminar_id = req.params.id;
  if (rating === undefined || user_id === undefined) {
    return res.status(400).json({ error: 'Rating and user_id are required' });
  }
  
  let seminars = dataStore.getSeminars();
  let purchases = dataStore.getPurchases();

  const purchase = purchases.find(p => p.user_id == user_id && p.seminar_id == seminar_id);
  if (!purchase) {
    return res.status(400).json({ error: 'You must purchase this seminar before rating it' });
  }
  if (purchase.rating !== null) {
    return res.status(400).json({ error: 'You have already rated this seminar' });
  }

  const seminar = seminars.find(s => s.id == seminar_id);
  if (!seminar) {
    return res.status(404).json({ error: 'Seminar not found' });
  }

  // Calculate the new average rating
  const currentTotal = seminar.rating * seminar.rating_count;
  seminar.rating_count += 1;
  seminar.rating = (currentTotal + rating) / seminar.rating_count;
  dataStore.saveSeminars(seminars);

  // Update the purchase record with the user's rating
  purchase.rating = rating;
  dataStore.savePurchases(purchases);

  res.json({ message: 'Rating submitted successfully' });
});

//update users progress
router.post('/seminars/:id/progress', (req, res) => {
  const { user_id, exercises_done } = req.body;
  const seminar_id = req.params.id;
  
  let purchases = dataStore.getPurchases();
  const purchase = purchases.find(p => p.user_id == user_id && p.seminar_id == seminar_id);
  
  if (!purchase) {
    return res.status(400).json({ error: 'Seminar not purchased' });
  }
  
  purchase.exercises_done = Number(exercises_done);
  dataStore.savePurchases(purchases);
  
  res.json({ message: 'Progress updated successfully', progress: purchase.exercises_done });
});


module.exports = router;
