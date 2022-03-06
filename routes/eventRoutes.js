const express = require('express');
const AuthController = require('../controllers/authController');
const eventController = require('../controllers/eventController');

const router = express.Router();

router.use(AuthController.protect);

router.post('/searchEvents', eventController.filterEvent);
router
    .route('/invitations')
    .get(eventController.getMyInvitations)
    .post(eventController.createInvitation);

router
    .route('/')
    .get(eventController.getAllEvents)
    .post(eventController.createEvent);

router
    .route('/:id')
    .get(eventController.getEventDetails)
    .patch(eventController.updateEvent);

module.exports = router;