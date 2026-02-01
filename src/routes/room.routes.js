const express = require("express");
const router = express.Router();
const adminOnly = require("../middleware/adminOnly");

const {
  createRoom,
  getRooms,
  getRoomById,
  updateRoomPut,
  updateRoomPatch,
  deleteRoom
} = require("../controllers/room.controller");

// PUBLIC
router.get("/", getRooms);
router.get("/:id", getRoomById);

// ADMIN
router.post("/", adminOnly, createRoom);
router.put("/:id", adminOnly, updateRoomPut);
router.patch("/:id", adminOnly, updateRoomPatch);
router.delete("/:id", adminOnly, deleteRoom);

module.exports = router;
