const express = require("express");
const Controller = require("../controllers/branch");
const checkAuth = require("./../middleware/token_verify");

const router = express.Router();

router.get("/", Controller.list);
router.get("/detail", Controller.detail);
router.post("/", Controller.add);
router.put("/", Controller.update);

module.exports = router;
