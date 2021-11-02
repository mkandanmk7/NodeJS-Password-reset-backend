const router = require("express").Router();

const service = require("../Services/resetPass.service");

// gen token and sending mail;
router.post("/", service.sendToken);

//verify resetToken and expiry time
router.post("/:userId/:token", service.verifyAndUpdatePassword);

router.get("/:userId/:token", service.verifyToken);

module.exports = router;
