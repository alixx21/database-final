const express = require("express");
const router = express.Router();
const adminOnly = require("../middleware/adminOnly");

const {
  createHotel,
  getHotels,
  getHotelById,
  updateHotelPut,
  updateHotelPatch,
  deleteHotel
} = require("../controllers/hotel.controller");

// PUBLIC
router.get("/", getHotels);
router.get("/:id", getHotelById);

// ADMIN
router.post("/", adminOnly, createHotel);
router.put("/:id", adminOnly, updateHotelPut);
router.patch("/:id", adminOnly, updateHotelPatch);
router.delete("/:id", adminOnly, deleteHotel);

module.exports = router;
