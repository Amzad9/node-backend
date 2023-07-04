const express = require("express");
const AdminController = require("../controllers/admin");
const checkAuth = require("./../middleware/token_verify");
const Delete = require("./../middleware/delete");
const router = express.Router();

router.get("/getBasicinfo", checkAuth, AdminController.getBasicinfo);

router.post("/login", AdminController.login);

router.get("/", AdminController.list);
router.post("/", AdminController.addUser);
router.put("/", checkAuth, AdminController.editUser);
router.delete("/", checkAuth, Delete.deleteData, AdminController.editUser);

router.get("/userDetail", checkAuth, AdminController.userDetail);

module.exports = router;
