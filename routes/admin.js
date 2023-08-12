const express = require("express");
const AdminController = require("../controllers/admin");
const checkAuth = require("./../middleware/token_verify");
const Delete = require("./../middleware/delete");
const router = express.Router();

router.get("/", checkAuth, AdminController.list);
router.post("/", checkAuth, AdminController.addUser);
router.get("/getBasicinfo", checkAuth, AdminController.getBasicinfo);
router.post("/login", AdminController.login);
router.get("/:_id", checkAuth, AdminController.userDetail);
router.put("/:_id", checkAuth, AdminController.editUser);
router.delete("/:_id", checkAuth, Delete.deleteData, AdminController.editUser);

module.exports = router;
