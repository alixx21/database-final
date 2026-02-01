const mongoose = require("mongoose");
const Room = require("../models/room.model");
const Hotel = require("../models/hotel.model");
const Booking = require("../models/booking.model");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * CREATE ROOM
 */
exports.createRoom = async (req, res) => {
  const { hotelId, roomNumber, type, pricePerNight, amenities, isActive } = req.body;

  if (!hotelId || !roomNumber || !type || pricePerNight === undefined) {
    return res.status(400).json({
      error: "hotelId, roomNumber, type, pricePerNight are required"
    });
  }

  if (!isValidObjectId(hotelId)) {
    return res.status(400).json({ error: "Invalid hotelId" });
  }

  const hotelExists = await Hotel.exists({ _id: hotelId });
  if (!hotelExists) {
    return res.status(400).json({ error: "Hotel not found for given hotelId" });
  }

  const room = await Room.create({
    hotelId,
    roomNumber,
    type,
    pricePerNight,
    amenities,
    isActive
  });

  return res.status(201).json(room);
};

/**
 * GET ROOMS (filters + availability)
 */
exports.getRooms = async (req, res) => {
  const { hotelId, minPrice, maxPrice, isActive, onlyAvailable } = req.query;

  const filter = {};

  if (hotelId) {
    if (!isValidObjectId(hotelId)) {
      return res.status(400).json({ error: "Invalid hotelId" });
    }
    filter.hotelId = new mongoose.Types.ObjectId(hotelId);
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.pricePerNight = {};
    if (minPrice !== undefined) filter.pricePerNight.$gte = Number(minPrice);
    if (maxPrice !== undefined) filter.pricePerNight.$lte = Number(maxPrice);
  }

  if (isActive !== undefined) {
    filter.isActive = isActive === "true";
  }

  const rooms = await Room.find(filter).lean();

  // если нужны только свободные комнаты
  if (onlyAvailable === "true") {
    const bookedRoomIds = await Booking.distinct("roomId", {
      status: { $in: ["PENDING", "CONFIRMED"] }
    });

    const freeRooms = rooms.filter(
      r => !bookedRoomIds.some(id => id.toString() === r._id.toString())
    );

    return res.json(freeRooms);
  }

  return res.json(rooms);
};

/**
 * GET ROOM BY ID
 */
exports.getRoomById = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid room id" });
  }

  const room = await Room.findById(id).lean();
  if (!room) {
    return res.status(404).json({ error: "Room not found" });
  }

  return res.json(room);
};

/**
 * UPDATE ROOM (PUT)
 */
exports.updateRoomPut = async (req, res) => {
  const { id } = req.params;
  const { hotelId, roomNumber, type, pricePerNight, amenities, isActive } = req.body;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid room id" });
  }

  if (!hotelId || !roomNumber || !type || pricePerNight === undefined) {
    return res.status(400).json({
      error: "hotelId, roomNumber, type, pricePerNight are required for PUT"
    });
  }

  if (!isValidObjectId(hotelId)) {
    return res.status(400).json({ error: "Invalid hotelId" });
  }

  const hotelExists = await Hotel.exists({ _id: hotelId });
  if (!hotelExists) {
    return res.status(400).json({ error: "Hotel not found for given hotelId" });
  }

  const updated = await Room.findByIdAndUpdate(
    id,
    { hotelId, roomNumber, type, pricePerNight, amenities, isActive },
    { new: true }
  ).lean();

  if (!updated) {
    return res.status(404).json({ error: "Room not found" });
  }

  return res.json(updated);
};

/**
 * UPDATE ROOM (PATCH)
 */
exports.updateRoomPatch = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid room id" });
  }

  const allowed = [
    "hotelId",
    "roomNumber",
    "type",
    "pricePerNight",
    "amenities",
    "isActive"
  ];

  const $set = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) {
      $set[key] = req.body[key];
    }
  }

  if ($set.hotelId !== undefined) {
    if (!isValidObjectId($set.hotelId)) {
      return res.status(400).json({ error: "Invalid hotelId" });
    }

    const hotelExists = await Hotel.exists({ _id: $set.hotelId });
    if (!hotelExists) {
      return res.status(400).json({ error: "Hotel not found for given hotelId" });
    }
  }

  const updated = await Room.findByIdAndUpdate(id, { $set }, { new: true }).lean();
  if (!updated) {
    return res.status(404).json({ error: "Room not found" });
  }

  return res.json(updated);
};


exports.deleteRoom = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid room id" });
  }

  const deleted = await Room.findByIdAndDelete(id).lean();
  if (!deleted) {
    return res.status(404).json({ error: "Room not found" });
  }

  return res.status(204).send();
};
