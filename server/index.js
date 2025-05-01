// server/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/multi-step-profile';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB Connected');
}).catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/locations', require('./routes/location'));

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// Serve React app in production
if (process.env.NODE_ENV === 'production') {
    // Serve static files from the React app
    const buildPath = path.join(__dirname, '../client/build');
    
    // Check if build directory exists
    if (fs.existsSync(buildPath)) {
        app.use(express.static(buildPath));
        app.get('*', (req, res) => {
            res.sendFile(path.resolve(buildPath, 'index.html'));
        });
    } else {
        console.error('Build directory not found:', buildPath);
        process.exit(1);
    }
}

// Root route for testing
app.get('/', (req, res) => {
    res.json({ message: 'Server is running', status: 'OK' });
});

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: 'Validation error',
            details: Object.values(err.errors).map(e => e.message)
        });
    }

    if (err.code === 11000) {
        return res.status(400).json({
            error: 'Duplicate key error',
            details: 'The username is already taken'
        });
    }

    if (err.name === 'MulterError') {
        return res.status(400).json({
            error: 'File upload error',
            details: err.message
        });
    }

    res.status(err.status || 500).json({
        error: err.message || 'Internal server error'
    });
});

// Not found middleware
app.use((req, res) => {
    res.status(404).json({
        error: 'Not found',
        details: 'The requested resource could not be found'
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
