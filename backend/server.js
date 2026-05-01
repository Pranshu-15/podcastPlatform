const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/podcasts', require('./routes/podcasts'));
app.use('/api/episodes', require('./routes/episodes'));

// Root route
app.get('/', (req, res) => {
    res.send('Podcast Platform Backend is running');
});

// Database Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error("No MONGO_URI provided in .env file");
} else {
    mongoose.connect(MONGO_URI)
        .then(() => {
            console.log('Successfully connected to MongoDB');
            app.listen(PORT, () => {
                console.log(`Server is running on port ${PORT}`);
            });
        })
        .catch((error) => {
            console.error('Error connecting to MongoDB:', error);
        });
}
