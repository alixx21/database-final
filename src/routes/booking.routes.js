const router = require('express').Router();
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');
const bookingController = require('../controllers/booking.controller');

// create booking (USER)
router.post('/', auth, role('USER'), bookingController.createBooking);

// cancel booking (USER)
router.put('/:id/cancel', auth, role('USER'), bookingController.cancelBooking);

// confirm booking (ADMIN)
router.put('/:id/confirm', auth, role('ADMIN'), bookingController.confirmBooking);

// check availability (public)
router.get('/availability', bookingController.checkAvailability);

module.exports = router;
