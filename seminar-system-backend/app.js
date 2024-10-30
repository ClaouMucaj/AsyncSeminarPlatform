const express = require('express');
const cors = require('cors');
const sequelize = require('./models/database');
const userRoutes = require('./routes/userRoutes');
const seminarRoutes = require('./routes/seminarRoutes');
const videoRoutes = require('./routes/videoRoutes');

// Import the Rating model to sync it
const Rating = require('./models/rating');

const app = express();

app.use(cors());
app.use(express.json());

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api', userRoutes);
app.use('/api', seminarRoutes);
app.use('/api', videoRoutes);

// Sync Database and Start Server
sequelize.sync({ force: false })
  .then(() => {
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch(err => console.log('Error: ' + err));
