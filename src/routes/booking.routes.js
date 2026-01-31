const router = require('express').Router();
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');
const controller = require('../controllers/booking.controller');

router.post('/', auth, role('USER'), controller.createBooking);
router.put('/:id/cancel', auth, role('USER'), controller.cancelBooking);
router.put('/:id/confirm', auth, role('ADMIN'), controller.confirmBooking);
router.get('/availability', controller.checkAvailability);

module.exports = router;
