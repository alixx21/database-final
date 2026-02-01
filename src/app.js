const express = require("express");
const path = require("path");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const bookingRoutes = require("./routes/booking.routes");
const paymentRoutes = require("./routes/payment.routes");
const analyticsRoutes = require("./routes/analytics.routes");

const hotelRoutes = require("./routes/hotel.routes");
const roomRoutes = require("./routes/room.routes");

const app = express();

app.use(express.json());

// фронт из папки public/
app.use(express.static(path.join(__dirname, "..", "public")));

// существующие роуты проекта
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/bookings", bookingRoutes);
app.use("/payments", paymentRoutes);
app.use("/analytics", analyticsRoutes);

// твои (участник B)
app.use("/api/hotels", hotelRoutes);
app.use("/api/rooms", roomRoutes);

module.exports = app;
