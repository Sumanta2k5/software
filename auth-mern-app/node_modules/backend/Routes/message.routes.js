const express= require ("express");
const { getMessages, sendMessage } = require ("../Controllers/message.controller.js");
const Auth = require ( "../Middlewares/Auth.js")

const router = express.Router();

router.get("/:id",Auth, getMessages);
router.post("/send/:id",Auth, sendMessage);

module.exports= router