const mongoose = require('mongoose');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Event = require('../models/eventModel');
const User = require('../models/userModel');
const Invitation = require('../models/invitationModel');

exports.createEvent = catchAsync(async (req, res, next) => {
    req.body.creater = req.user._id;
    const eventDoc = await Event.create(req.body);

    res.status(200).json({
        status: 'succes',
        data: eventDoc
    });
});

exports.createInvitation = catchAsync(async (req, res, next) => {
    const invitationDoc = await Invitation.create(req.body);

    res.status(200).json({
        status: 'succes',
        data: invitationDoc
    });
});

exports.getAllEvents = catchAsync(async (req, res, next) => {
    const eventDoc = await Event.find({ isActive: true, creater: req.user._id })
        .populate({ path: 'creater', select: 'name email' })
        .sort({ createdAt: -1 })
        .skip(+req.query.pageNumber)
        .limit(+req.query.itemsPerPage);

    res.status(200).json({
        status: 'succes',
        data: eventDoc
    });
});

exports.getMyInvitations = catchAsync(async (req, res, next) => {
    const skip = (+req.query.pageNumber - 1)
    console.log(+req.query.pageNumber);
    const invitationDoc = await Invitation.aggregate([
        {
            $match: { guest: new mongoose.Types.ObjectId(req.user._id) }
        },
        { $sort: { createdAt: -1 } },
        // {$skip: skip},
        // {$limit: limit},
        {
            $lookup: {
                from: 'events',
                localField: 'eventId',
                foreignField: '_id',
                as: 'event'
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'event.creater',
                foreignField: '_id',
                as: 'createrDetails'
            }
        },
    ]);

    res.status(200).json({
        status: 'succes',
        data: invitationDoc
    });
});

exports.getEventDetails = catchAsync(async (req, res, next) => {
    const invitationDoc = await Invitation.aggregate([
        {
            $match: { eventId: new mongoose.Types.ObjectId(req.params.id) }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'guest',
                foreignField: '_id',
                as: 'guestDetails'
            }
        },
        { $unwind: "$guestDetails" },
        {
            $group: {
                _id: '$eventId',
                guests: { $push: "$guestDetails" }
            }
        },
        {
            $lookup: {
                from: 'events',
                localField: '_id',
                foreignField: '_id',
                as: 'eventDetails'
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'eventDetails.creater',
                foreignField: '_id',
                as: 'createrDetails'
            }
        },
        {
            $project: {
                eventDetails: 1,
                guests: 1,
                _id: 0
            }
        }
    ]);

    res.status(200).json({
        status: 'succes',
        data: invitationDoc
    });
});

exports.updateEvent = catchAsync(async (req, res, next) => {
    const eventDoc = await Event.findOneAndUpdate({ _id: req.params.id, creater: req.user._id }, req.body, { new: true, runValidators: true });
    if (!eventDoc) {
        return next(new AppError('No event found', 404));
    }

    res.status(200).json({
        status: 'succes',
        data: eventDoc
    });
});

exports.filterEvent = catchAsync(async (req, res, next) => {
    let filter = { title: { $regex: req.body.searchTerm, $options: "$i" } };
    if (Date.parse(req.body)) {
        filter = { createdAt: { $gt: new Date(new Date(req.body.searchTerm).toISOString().split('T')[0]) } };
    }

    const eventDoc = await Event.find(filter);

    res.status(200).json({
        status: 'succes',
        data: eventDoc
    });
});
