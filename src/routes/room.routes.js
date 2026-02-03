const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const roleOnly = require("../middlewares/role.middleware");

const {
  createRoom,
  getRooms,
  getRoomById,
  updateRoomPut,
  updateRoomPatch,
  deleteRoom
} = require("../controllers/room.controller");

router.get("/", getRooms);
router.get("/:id", getRoomById);

router.post("/", auth, roleOnly("admin"), createRoom);
router.put("/:id", auth, roleOnly("admin"), updateRoomPut);
router.patch("/:id", auth, roleOnly("admin"), updateRoomPatch);
router.delete("/:id", auth, roleOnly("admin"), deleteRoom);

module.exports = router;
module.exports = router;
