const express = require("express");
const Controller = require("../controllers/restaurant");

const checkAuth = require("./../middleware/token_verify");
const checkOwner = require("./../middleware/owner_verify");

const router = express.Router();

router.post(
  "/addRestaurantOwner",
  checkOwner,
  Controller.addRestaurantOwner
);

// router.get("/detail", checkAuth, Controller.detail);
// router.get("/getSettings", checkAuth, Controller.getSettings);
// router.put("/update", checkAuth, Controller.update);
// router.put("/updateSettings", checkAuth, Controller.updateSettings);

// router.put("/delete", Controller.delete);

module.exports = router;
