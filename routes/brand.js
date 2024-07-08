const express = require("express");
const Controller = require("../controllers/brand");
const checkAuth = require("./../middleware/token_verify");
const Delete = require("./../middleware/delete");

const router = express.Router();

router.get("/", Controller.list);
router.get("/:_id", Controller.detail);
router.post("/", Controller.add);
router.put("/:_id", Controller.edit);
router.delete("/:_id", Delete.deleteData, Controller.edit);

module.exports = router;
