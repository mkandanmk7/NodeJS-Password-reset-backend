const mongo = require("../Shared/mongo");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const sendMail = require("../Shared/sendMailer");
const { ObjectId } = require("mongodb"); //driver

const service = {
  async sendToken(req, res, next) {
    let userExist = await mongo.register.findOne({ email: req.body.email });
    console.log(userExist);
    // res.status(200).send({ key: "user result done", result: userExist });
    //check exist or not
    if (!userExist) res.status(400).send("user doesn't exists");
  },
};

module.exports = service;
