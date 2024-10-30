const express = require('express');
const cors = require('cors');
const path = require('path');  // Import path to resolve the uploads directory

const userRoutes = require('./routes/userRoutes');
const seminarRoutes = require('./routes/seminarRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the "uploads" folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', userRoutes);
app.use('/api', seminarRoutes);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
