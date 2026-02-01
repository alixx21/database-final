const express = require("express");
const path = require("path");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const bookingRoutes = require("./routes/booking.routes");
const paymentRoutes = require("./routes/payment.routes");
const analyticsRoutes = require("./routes/analytics.routes");

const hotelRoutes = require("./routes/hotel.routes");
app.use("/api/hotels", hotelRoutes);
const roomRoutes = require("./routes/room.routes");
app.use("/api/rooms", roomRoutes);

const app = express();
app.use(express.json());

app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/bookings", bookingRoutes);
app.use("/payments", paymentRoutes);
app.use("/analytics", analyticsRoutes);

app.use("/api/hotels", hotelRoutes);
app.use("/api/rooms", roomRoutes);

module.exports = app;
