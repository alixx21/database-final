const Hotel = require("../models/hotel.model");
const mongoose = require("mongoose");

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

exports.createHotel = async (req, res) => {
  const { name, city, address, description, rating } = req.body;
  if (!name || !city || !address) return res.status(400).json({ error: "name, city, address are required" });

  const created = await Hotel.create({ name, city, address, description, rating });
  return res.status(201).json(created);
};

exports.getHotels = async (req, res) => {
  const filter = {};
  if (req.query.city) filter.city = req.query.city;

  const hotels = await Hotel.find(filter).lean();
  return res.json(hotels);
};

exports.getHotelById = async (req, res) => {
  if (!isValidId(req.params.id)) return res.status(400).json({ error: "Invalid hotel id" });

  const hotel = await Hotel.findById(req.params.id).lean();
  if (!hotel) return res.status(404).json({ error: "Hotel not found" });

  return res.json(hotel);
};

exports.updateHotelPut = async (req, res) => {
  if (!isValidId(req.params.id)) return res.status(400).json({ error: "Invalid hotel id" });

  const { name, city, address, description, rating } = req.body;
  if (!name || !city || !address) return res.status(400).json({ error: "name, city, address are required for PUT" });

  const updated = await Hotel.findByIdAndUpdate(
    req.params.id,
    { name, city, address, description, rating },
    { new: true }
  ).lean();

  if (!updated) return res.status(404).json({ error: "Hotel not found" });
  return res.json(updated);
};

exports.updateHotelPatch = async (req, res) => {
  if (!isValidId(req.params.id)) return res.status(400).json({ error: "Invalid hotel id" });

  const allowed = ["name", "city", "address", "description", "rating"];
  const $set = {};
  for (const k of allowed) if (req.body[k] !== undefined) $set[k] = req.body[k];

  const updated = await Hotel.findByIdAndUpdate(req.params.id, { $set }, { new: true }).lean();
  if (!updated) return res.status(404).json({ error: "Hotel not found" });

  return res.json(updated);
};

exports.deleteHotel = async (req, res) => {
  if (!isValidId(req.params.id)) return res.status(400).json({ error: "Invalid hotel id" });

  const deleted = await Hotel.findByIdAndDelete(req.params.id).lean();
  if (!deleted) return res.status(404).json({ error: "Hotel not found" });

  return res.status(204).send();
};
