const express = require('express');
const Video = require('../models/video');
const router = express.Router();

router.post('/videos', async (req, res) => {
  const { url, seminar_id } = req.body;
  try {
    const video = await Video.create({ url, seminar_id });
    res.status(201).json(video);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
