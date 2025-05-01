const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

// Update profile
router.post('/update', auth, upload.single('photo'), async (req, res) => {
    try {
        const { username, currentPassword, newPassword, profession, companyName, 
                addressLine1, country, state, city, subscriptionPlan, newsletter, 
                gender, customGender, dob } = req.body;

        // Validate required fields
        const validationErrors = [];
        
        if (!req.file && !req.user.photo) {
            validationErrors.push('Profile photo is required');
        }

        if (!username) {
            validationErrors.push('Username is required');
        } else if (username.length < 4 || username.length > 20) {
            validationErrors.push('Username must be 4-20 characters');
        } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            validationErrors.push('Username can only contain letters, numbers, and underscores');
        }

        if (!currentPassword) {
            validationErrors.push('Current password is required');
        }

        if (newPassword) {
            if (newPassword.length < 8) {
                validationErrors.push('New password must be at least 8 characters');
            }
        }

        if (!profession) {
            validationErrors.push('Profession is required');
        }

        if (profession === 'Entrepreneur' && !companyName) {
            validationErrors.push('Company name is required for entrepreneurs');
        }

        if (!addressLine1) {
            validationErrors.push('Address line 1 is required');
        }

        if (!country) {
            validationErrors.push('Country is required');
        }

        if (!state) {
            validationErrors.push('State is required');
        }

        if (!city) {
            validationErrors.push('City is required');
        }

        if (!gender) {
            validationErrors.push('Gender is required');
        }

        if (gender === 'other' && !customGender) {
            validationErrors.push('Custom gender is required when selecting "Other"');
        }

        if (!dob) {
            validationErrors.push('Date of birth is required');
        } else {
            const dobDate = new Date(dob);
            if (dobDate > new Date()) {
                validationErrors.push('Date of birth cannot be in the future');
            }
        }

        if (validationErrors.length > 0) {
            return res.status(400).json({
                errors: validationErrors
            });
        }

        // Verify current password
        const isPasswordValid = await req.user.comparePassword(currentPassword);
        if (!isPasswordValid) {
            return res.status(400).json({
                errors: ['Current password is incorrect']
            });
        }

        // Update user
        const updates = {
            username,
            profession,
            companyName,
            'address.line1': addressLine1,
            'address.country': country,
            'address.state': state,
            'address.city': city,
            subscriptionPlan,
            newsletter,
            gender,
            customGender,
            dob
        };

        if (req.file) {
            updates.photo = `/uploads/${req.file.filename}`;
        }

        if (newPassword) {
            updates.password = newPassword;
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            updates,
            { new: true, runValidators: true }
        ).catch(err => {
            if (err.name === 'ValidationError') {
                return res.status(400).json({
                    errors: Object.values(err.errors).map(e => e.message)
                });
            }
            throw err;
        });

        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: updatedUser
        });

    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({
            errors: ['Internal server error']
        });
    }
});

// Get user profile
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .select('-password') // Don't send password in response
            .populate('address.country', 'name')
            .populate('address.state', 'name')
            .populate('address.city', 'name');

        if (!user) {
            return res.status(404).json({
                errors: ['User not found']
            });
        }

        res.json(user);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({
            errors: ['Internal server error']
        });
    }
});

// Check username availability
router.post('/check-username', async (req, res) => {
    try {
        const { username } = req.body;
        const user = await User.findOne({ username });
        res.json({ available: !user });
    } catch (error) {
        console.error('Username check error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;