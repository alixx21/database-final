import Hotel from "../models/hotel.model.js";

export const createHotel = async (req, res) => {
  const { name, city, address, description, rating } = req.body;

  const hotel = await Hotel.create({
    name,
    city,
    address,
    description,
    rating
  });

  return res.status(201).json(hotel);
};

export const getHotels = async (req, res) => {
  const filter = {};
  if (req.query.city) filter.city = req.query.city;

  const hotels = await Hotel.find(filter).lean();
  return res.json(hotels);
};

export const getHotelById = async (req, res) => {
  const hotel = await Hotel.findById(req.params.id).lean();
  return res.json(hotel);
};

export const updateHotelPut = async (req, res) => {
  const { name, city, address, description, rating } = req.body;

  const updated = await Hotel.findByIdAndUpdate(
    req.params.id,
    { name, city, address, description, rating },
    { new: true }
  );

  return res.json(updated);
};

export const updateHotelPatch = async (req, res) => {
  const updated = await Hotel.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true }
  );

  return res.json(updated);
};

export const deleteHotel = async (req, res) => {
  await Hotel.findByIdAndDelete(req.params.id);
  return res.status(204).send();
};
