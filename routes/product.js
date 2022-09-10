const express = require("express");
const Controller = require("../controllers/product");
const checkAuth = require("./../middleware/token_verify");
const Delete = require("./../middleware/delete");

const router = express.Router();

router.get("/list", checkAuth, Controller.list);
router.post("/add", checkAuth, Controller.add);
router.get("/detail", checkAuth, Controller.detail);
router.put("/custom", checkAuth, Controller.custom);
router.put("/edit", checkAuth, Controller.edit);
router.delete("/delete", checkAuth, Delete.deleteData, Controller.edit);
router.put("/updateModifier", checkAuth, Controller.updateModifier);

module.exports = router;
