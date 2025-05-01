// server/routes/location.js
const express = require('express');
const router = express.Router();
const Location = require('../models/Location');

// Get all countries
router.get('/countries', async (req, res) => {
    try {
        const countries = await Location.find({ type: 'country' });
        res.json(countries);
    } catch (error) {
        console.error('Error fetching countries:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get states for a country
router.get('/states/:countryId', async (req, res) => {
    try {
        const states = await Location.find({ type: 'state', parent: req.params.countryId });
        res.json(states);
    } catch (error) {
        console.error('Error fetching states:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get cities for a state
router.get('/cities/:stateId', async (req, res) => {
    try {
        const cities = await Location.find({ type: 'city', parent: req.params.stateId });
        res.json(cities);
    } catch (error) {
        console.error('Error fetching cities:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;