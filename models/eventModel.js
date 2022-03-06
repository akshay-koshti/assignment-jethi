const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    creater: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Please provide us userId']
    },
    title: {
        type: String,
        required: [true, 'Please provide us event title']
    },
    description: String,
    isActive: {
        type: Boolean,
        default: true
    }
},
    {
        toObject: { virtuals: true },
        timestamps: true
    });

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;