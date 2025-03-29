const express = require("express");
const Auth = require("../Middlewares/Auth");
const  getUsersForSidebar  = require("../Controllers/user.controller.js");

const router = express.Router();

router.get("/", Auth , getUsersForSidebar);

module.exports = router;