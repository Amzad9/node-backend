const express = require("express");
const Controller = require("../controllers/branch");
const checkAuth = require("./../middleware/token_verify");

const router = express.Router();

router.get("/", checkAuth, Controller.list);
router.get("/detail", checkAuth, Controller.detail);
router.post("/", checkAuth, Controller.add);
router.put("/", checkAuth, Controller.update);

module.exports = router;
