const router = require("express").Router();

const service = require("../Services/resetPass.service");

// gen token and sending mail;
router.post("/", service.sendToken);

//verify resetToken and expiry time

router.get("/:userId/:token", service.verifyToken);

router.post("/:userId/:token", service.verifyAndUpdatePassword);

module.exports = router;
