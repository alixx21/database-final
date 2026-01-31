const Booking = require('../models/booking.model');

exports.createBooking = async (req, res) => {
  const { roomId, checkIn, checkOut, totalPrice } = req.body;

  if (new Date(checkIn) >= new Date(checkOut)) {
    return res.status(400).json({ message: 'Invalid date range' });
  }

  const overlap = await Booking.findOne({
    roomId,
    status: { $ne: 'CANCELED' },
    checkIn: { $lt: new Date(checkOut) },
    checkOut: { $gt: new Date(checkIn) }
  });

  if (overlap) {
    return res.status(409).json({ message: 'Room not available' });
  }

  const booking = await Booking.create({
    userId: req.user.userId,
    roomId,
    checkIn,
    checkOut,
    totalPrice,
    status: 'PENDING',
    statusHistory: [
      { status: 'PENDING', changedAt: new Date() }
    ]
  });

  res.status(201).json(booking);
};



exports.cancelBooking = async (req, res) => {
  const booking = await Booking.findOneAndUpdate(
    {
      _id: req.params.id,
      userId: req.user.userId,
      status: { $ne: 'CANCELED' }
    },
    {
      $set: { status: 'CANCELED' },
      $push: {
        statusHistory: {
          status: 'CANCELED',
          changedAt: new Date()
        }
      }
    },
    { new: true }
  );

  if (!booking) {
    return res.status(404).json({ message: 'Booking not found or forbidden' });
  }

  res.json(booking);
};


exports.confirmBooking = async (req, res) => {
  const booking = await Booking.findOneAndUpdate(
    {
      _id: req.params.id,
      status: 'PENDING'
    },
    {
      $set: { status: 'CONFIRMED' },
      $push: {
        statusHistory: {
          status: 'CONFIRMED',
          changedAt: new Date()
        }
      }
    },
    { new: true }
  );

  if (!booking) {
    return res.status(400).json({ message: 'Invalid booking state' });
  }

  res.json(booking);
};



exports.checkAvailability = async (req, res) => {
  const { roomId, checkIn, checkOut } = req.query;

  const conflict = await Booking.findOne({
    roomId,
    status: { $ne: 'CANCELED' },
    checkIn: { $lt: new Date(checkOut) },
    checkOut: { $gt: new Date(checkIn) }
  });

  res.json({ available: !conflict });
};
