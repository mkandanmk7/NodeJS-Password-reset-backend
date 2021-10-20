const router = require("express").Router();

const service = require("../Services/users.service");

router.post("/register", service.register);

module.exports = router;
