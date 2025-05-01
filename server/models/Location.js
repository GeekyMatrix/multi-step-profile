// server/models/Location.js
const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['country', 'state', 'city'],
        required: true
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
        required: function() {
            return this.type !== 'country';
        }
    }
}, {
    timestamps: true
});

// Index for faster lookups
locationSchema.index({ type: 1, parent: 1 });

module.exports = mongoose.model('Location', locationSchema);