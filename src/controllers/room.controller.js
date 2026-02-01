const mongoose = require("mongoose");
const Room = require("../models/room.model");
const Hotel = require("../models/hotel.model");
<<<<<<< HEAD
const Booking = require("../models/booking.model");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * CREATE ROOM
 */
=======

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

>>>>>>> bb0673c61b26595e93141f26a89c89228a5835fc
exports.createRoom = async (req, res) => {
  const { hotelId, roomNumber, type, pricePerNight, amenities, isActive } = req.body;

  if (!hotelId || !roomNumber || !type || pricePerNight === undefined) {
<<<<<<< HEAD
    return res.status(400).json({
      error: "hotelId, roomNumber, type, pricePerNight are required"
    });
  }

  if (!isValidObjectId(hotelId)) {
    return res.status(400).json({ error: "Invalid hotelId" });
  }

=======
    return res.status(400).json({ error: "hotelId, roomNumber, type, pricePerNight are required" });
  }
  if (!isValidObjectId(hotelId)) {
    return res.status(400).json({ error: "Invalid hotelId" });
  }
>>>>>>> bb0673c61b26595e93141f26a89c89228a5835fc
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

<<<<<<< HEAD
/**
 * GET ROOMS (filters + availability)
 */
exports.getRooms = async (req, res) => {
  const { hotelId, minPrice, maxPrice, isActive, onlyAvailable } = req.query;
=======
exports.getRooms = async (req, res) => {
  const { hotelId, minPrice, maxPrice, isActive } = req.query;
>>>>>>> bb0673c61b26595e93141f26a89c89228a5835fc

  const filter = {};

  if (hotelId) {
<<<<<<< HEAD
    if (!isValidObjectId(hotelId)) {
      return res.status(400).json({ error: "Invalid hotelId" });
    }
=======
    if (!isValidObjectId(hotelId)) return res.status(400).json({ error: "Invalid hotelId" });
>>>>>>> bb0673c61b26595e93141f26a89c89228a5835fc
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
<<<<<<< HEAD

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
=======
  return res.json(rooms);
};

exports.getRoomById = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) return res.status(400).json({ error: "Invalid room id" });

  const room = await Room.findById(id).lean();
  if (!room) return res.status(404).json({ error: "Room not found" });
>>>>>>> bb0673c61b26595e93141f26a89c89228a5835fc

  return res.json(room);
};

<<<<<<< HEAD
/**
 * UPDATE ROOM (PUT)
 */
=======
>>>>>>> bb0673c61b26595e93141f26a89c89228a5835fc
exports.updateRoomPut = async (req, res) => {
  const { id } = req.params;
  const { hotelId, roomNumber, type, pricePerNight, amenities, isActive } = req.body;

<<<<<<< HEAD
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
=======
  if (!isValidObjectId(id)) return res.status(400).json({ error: "Invalid room id" });
  if (!hotelId || !roomNumber || !type || pricePerNight === undefined) {
    return res.status(400).json({ error: "hotelId, roomNumber, type, pricePerNight are required for PUT" });
  }
  if (!isValidObjectId(hotelId)) return res.status(400).json({ error: "Invalid hotelId" });

  const hotelExists = await Hotel.exists({ _id: hotelId });
  if (!hotelExists) return res.status(400).json({ error: "Hotel not found for given hotelId" });
>>>>>>> bb0673c61b26595e93141f26a89c89228a5835fc

  const updated = await Room.findByIdAndUpdate(
    id,
    { hotelId, roomNumber, type, pricePerNight, amenities, isActive },
    { new: true }
  ).lean();

<<<<<<< HEAD
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
=======
  if (!updated) return res.status(404).json({ error: "Room not found" });
  return res.json(updated);
};

exports.updateRoomPatch = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) return res.status(400).json({ error: "Invalid room id" });

  const allowed = ["hotelId", "roomNumber", "type", "pricePerNight", "amenities", "isActive"];
  const $set = {};
  for (const k of allowed) {
    if (req.body[k] !== undefined) $set[k] = req.body[k];
  }

  if ($set.hotelId !== undefined) {
    if (!isValidObjectId($set.hotelId)) return res.status(400).json({ error: "Invalid hotelId" });
    const hotelExists = await Hotel.exists({ _id: $set.hotelId });
    if (!hotelExists) return res.status(400).json({ error: "Hotel not found for given hotelId" });
  }

  const updated = await Room.findByIdAndUpdate(id, { $set }, { new: true }).lean();
  if (!updated) return res.status(404).json({ error: "Room not found" });
>>>>>>> bb0673c61b26595e93141f26a89c89228a5835fc

  return res.json(updated);
};

<<<<<<< HEAD
/**
 * DELETE ROOM
 */
exports.deleteRoom = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid room id" });
  }

  const deleted = await Room.findByIdAndDelete(id).lean();
  if (!deleted) {
    return res.status(404).json({ error: "Room not found" });
  }
=======
exports.deleteRoom = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) return res.status(400).json({ error: "Invalid room id" });

  const deleted = await Room.findByIdAndDelete(id).lean();
  if (!deleted) return res.status(404).json({ error: "Room not found" });
>>>>>>> bb0673c61b26595e93141f26a89c89228a5835fc

  return res.status(204).send();
};
