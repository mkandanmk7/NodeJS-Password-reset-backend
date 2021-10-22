const router = require("express").Router();

const service = require("../Services/resetPass.service");

// gen token and sending mail;
router.post("/", service.sendToken);

// get token and verifing;
// router.get("/:userId/:token",service.verifyToken);

module.exports = router;
