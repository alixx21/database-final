import { Router } from "express";
import {
  createHotel,
  getHotels,
  getHotelById,
  updateHotelPut,
  updateHotelPatch,
  deleteHotel
} from "../controllers/hotel.controller.js";

const router = Router();

router.post("/", createHotel);
router.get("/", getHotels);
router.get("/:id", getHotelById);
router.put("/:id", updateHotelPut);
router.patch("/:id", updateHotelPatch);
router.delete("/:id", deleteHotel);

export default router;
