const router = require("express").Router();
const c = require("../controllers/hotel.controller");

router.post("/", c.createHotel);
router.get("/", c.getHotels);
router.get("/:id", c.getHotelById);
router.put("/:id", c.updateHotelPut);
router.patch("/:id", c.updateHotelPatch);
router.delete("/:id", c.deleteHotel);

module.exports = router;
