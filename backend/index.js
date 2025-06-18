const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
require('dotenv').config();

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/students', require('./routes/student'));

app.use('/api/data', require('./routes/data'));

app.use('/api/summary', require('./routes/summary'));

app.get('/', (req, res) => {
  res.send('Student Progress Management System API');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

require('./jobs/nightlySync');
