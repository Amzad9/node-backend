const express = require("express");
const Controller = require("../controllers/product");
const checkAuth = require("./../middleware/token_verify");
const Delete = require("./../middleware/delete");

const router = express.Router();

router.get("/", checkAuth, Controller.list);
router.post("/", checkAuth, Controller.add);
router.put("/", checkAuth, Controller.edit);
router.delete("/", checkAuth, Delete.deleteData, Controller.edit);
router.get("/detail", checkAuth, Controller.detail);
router.put("/custom", checkAuth, Controller.custom);
router.put("/updateModifier", checkAuth, Controller.updateModifier);

module.exports = router;
