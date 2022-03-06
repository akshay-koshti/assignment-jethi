const mongoose = require('mongoose');

const invitationSchema = mongoose.Schema({
    guest: {
        type: mongoose.Schema.ObjectId,
        reff: 'User',
        required: [true, 'Guest userId is required']
    },
    eventId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Event',
        required: [true, 'Please provide us eventId']
    },
    isActive: {
        type: Boolean,
        default: true
    }
},
    {
        toObject: { virtuals: true },
        timestamps: true
    });

const Invitation = mongoose.model('Invitation', invitationSchema);

module.exports = Invitation;