const express = require("express");
const Controller = require("../controllers/branch");
const checkAuth = require("./../middleware/token_verify");
const Delete = require("./../middleware/delete");

const router = express.Router();

router.get("/", Controller.list);
router.get("/:_id", Controller.detail);
router.post("/", Controller.add);
router.put("/:_id", Controller.update);
router.delete("/:_id", Delete.deleteData, Controller.update);

module.exports = router;
