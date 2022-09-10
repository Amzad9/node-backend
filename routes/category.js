const express = require("express");
const Controller = require("../controllers/category");
const checkAuth = require("./../middleware/token_verify");
const Delete = require("./../middleware/delete");

const router = express.Router();

router.get("/list", checkAuth, Controller.list);
router.get("/detail", checkAuth, Controller.detail);
router.post("/add", checkAuth, Controller.add);
router.put("/edit", checkAuth, Controller.edit);
router.put("/reorder", checkAuth, Controller.reorder);
router.delete("/delete", checkAuth, Delete.deleteData, Controller.edit);

module.exports = router;
