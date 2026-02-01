import hotelRoutes from "./routes/hotel.routes.js";
import roomRoutes from "./routes/room.routes.js";


const express = require('express');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const bookingRoutes = require('./routes/booking.routes');
const paymentRoutes = require('./routes/payment.routes');
const analyticsRoutes = require('./routes/analytics.routes');

const app = express();
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/bookings', bookingRoutes);
app.use('/payments', paymentRoutes);
app.use('/analytics', analyticsRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/rooms", roomRoutes);

module.exports = app;
