const express = require("express");
const Controller = require("../controllers/product");
const checkAuth = require("./../middleware/token_verify");
const Delete = require("./../middleware/delete");

const router = express.Router();

router.get("/", checkAuth, Controller.list);
router.post("/", checkAuth, Controller.add);
router.put("/:_id", checkAuth, Controller.edit);
router.delete("/:_id", checkAuth, Delete.deleteData, Controller.edit);
router.get("/:_id", checkAuth, Controller.detail);
router.put("/custom", checkAuth, Controller.custom);
router.put("/updateModifier", checkAuth, Controller.updateModifier);

module.exports = router;
