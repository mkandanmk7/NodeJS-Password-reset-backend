const router = require("express").Router();

const service = require("../Services/resetPass.service");

// gen token and sending mail;
router.post("/", service.sendToken);

//verify resetToken and expiry time

router.post("/", service.verifyToken);

// get token and verifing;
// router.get("/:userId/:token",service.verifyToken);

module.exports = router;
