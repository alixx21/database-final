const Booking = require('../models/booking.model');
const Room = require('../models/room.model');

/**
 * CREATE BOOKING
 */
exports.createBooking = async (req, res) => {
  const userId = req.user.id;
  const { roomId } = req.body;

  if (!roomId) {
    return res.status(400).json({ error: "roomId is required" });
  }

  const room = await Room.findById(roomId);
  if (!room) {
    return res.status(404).json({ error: "Room not found" });
  }

  const exists = await Booking.findOne({
    roomId,
    status: { $in: ["PENDING", "CONFIRMED"] }
  });

  if (exists) {
    return res.status(400).json({ error: "Room already booked" });
  }

  const checkIn = new Date();
  const checkOut = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

  const booking = await Booking.create({
    userId,
    roomId,
    checkIn,
    checkOut,
    totalPrice: room.pricePerNight * 3,
    status: "CONFIRMED",
    statusHistory: [{ status: "CONFIRMED", changedAt: new Date() }],
    createdAt: new Date()
  });

  res.status(201).json(booking);
};


/**
 * CANCEL BOOKING
 */
exports.cancelBooking = async (req, res) => {
  const booking = await Booking.findOneAndUpdate(
    {
      _id: req.params.id,
      userId: req.user.userId || req.user.id,
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

/**
 * CONFIRM BOOKING (admin / payment success)
 */
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

/**
 * CHECK AVAILABILITY
 */
exports.checkAvailability = async (req, res) => {
  const { roomId, checkIn, checkOut } = req.query;

  if (!roomId || !checkIn || !checkOut) {
    return res.status(400).json({ message: 'roomId, checkIn, checkOut required' });
  }

  const conflict = await Booking.findOne({
    roomId,
    status: { $ne: 'CANCELED' },
    checkIn: { $lt: new Date(checkOut) },
    checkOut: { $gt: new Date(checkIn) }
  });

  res.json({ available: !conflict });
};
