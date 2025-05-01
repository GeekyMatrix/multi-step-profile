// server/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 4,
        maxlength: 20,
        match: /^[a-zA-Z0-9_]+$/ // Only alphanumeric and underscore allowed
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    photo: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return v.endsWith('.jpg') || v.endsWith('.jpeg') || v.endsWith('.png');
            },
            message: 'Photo must be a JPG or PNG file'
        }
    },
    profession: {
        type: String,
        enum: ['Student', 'Developer', 'Entrepreneur'],
        required: true
    },
    companyName: {
        type: String
    },
    address: {
        line1: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        }
    },
    subscriptionPlan: {
        type: String,
        enum: ['Basic', 'Pro', 'Enterprise'],
        default: 'Basic'
    },
    newsletter: {
        type: Boolean,
        default: true
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: true
    },
    customGender: {
        type: String
    },
    dob: {
        type: Date,
        required: true,
        validate: {
            validator: function(v) {
                return v <= new Date();
            },
            message: 'Date of birth cannot be in the future'
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Method to check if user is an entrepreneur
userSchema.methods.isEntrepreneur = function() {
    return this.profession === 'Entrepreneur';
};

// Method to check if user has a valid subscription
userSchema.methods.hasValidSubscription = function() {
    return ['Pro', 'Enterprise'].includes(this.subscriptionPlan);
};

module.exports = mongoose.model('User', userSchema);