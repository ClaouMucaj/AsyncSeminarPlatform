const express = require('express');
const multer = require('multer');
const Seminar = require('../models/seminar');
const Purchase = require('../models/purchase');
const User = require('../models/user');
const router = express.Router();

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// Create a new seminar
router.post('/seminars', upload.single('preview_image'), async (req, res) => {
  const { title, description, created_by, exercises, duration, difficulty, price } = req.body;
  const preview_image = req.file ? `/uploads/${req.file.filename}` : '/uploads/notfound.jpg';
  try {
    const seminar = await Seminar.create({ title, description, created_by, exercises, duration, difficulty, price, preview_image });
    res.status(201).json(seminar);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all seminars
router.get('/seminars', async (req, res) => {
  try {
    const seminars = await Seminar.findAll();
    res.json(seminars);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Purchase a seminar
router.post('/seminars/:id/buy', async (req, res) => {
  const { user_id } = req.body;
  const { id: seminar_id } = req.params;

  try {
    // Check if seminar exists
    const seminar = await Seminar.findByPk(seminar_id);
    if (!seminar) {
      return res.status(404).json({ error: 'Seminar not found' });
    }

    // Check if user has sufficient balance
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (user.balance < seminar.price) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Check if the user has already purchased this seminar
    const existingPurchase = await Purchase.findOne({ where: { user_id, seminar_id } });
    if (existingPurchase) {
      return res.status(400).json({ error: 'Seminar already purchased' });
    }

    // Create a new purchase entry
    await Purchase.create({ user_id, seminar_id });
    user.balance -= seminar.price;
    await user.save();

    res.json({ message: 'Seminar purchased successfully' });
  } catch (error) {
    console.error("Error purchasing seminar:", error);
    res.status(500).json({ error: error.message });
  }
});

// Mark seminar as complete
router.post('/seminars/:id/complete', async (req, res) => {
  const { user_id } = req.body;
  const { id: seminar_id } = req.params;

  try {
    const purchase = await Purchase.findOne({ where: { user_id, seminar_id } });
    if (!purchase) return res.status(400).json({ error: 'Seminar not purchased' });

    purchase.completed = true;
    await purchase.save();

    res.json({ message: 'Seminar marked as complete' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
