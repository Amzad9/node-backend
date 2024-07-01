const express = require("express");
const Controller = require("../controllers/product");
const checkAuth = require("./../middleware/token_verify");
const Delete = require("./../middleware/delete");

const router = express.Router();

router.get("/", Controller.list);
router.post("/", Controller.add);
router.put("/:_id", Controller.edit);
router.delete("/:_id", Delete.deleteData, Controller.edit);
router.get("/:_id", Controller.detail);
router.put("/custom", Controller.custom);
router.put("/updateModifier", Controller.updateModifier);

module.exports = router;
