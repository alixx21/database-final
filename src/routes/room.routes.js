import { Router } from "express";
import {
  createRoom,
  getRooms,
  getRoomById,
  updateRoomPut,
  updateRoomPatch,
  deleteRoom
} from "../controllers/room.controller.js";

const router = Router();

router.post("/", createRoom);
router.get("/", getRooms);            
router.put("/:id", updateRoomPut);
router.patch("/:id", updateRoomPatch);
router.delete("/:id", deleteRoom);

export default router;
