const mongo = require("../Shared/mongo");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const { reqisterSchema, registerSchema } = require("../Shared/schema");

const service = {
  async register(req, res) {
    try {
      //validation using joi schema (value,error)
      const { value, error } = await registerSchema.validate(req.body);
      //   console.log(value);
      //   console.log(error);
      if (error)
        return res.status(400).send({ Error: error.details[0].message });

      // check email exist or not
      const emailExist = await mongo.register.findOne({
        email: req.body.email,
      });
      console.log(emailExist); // null if email not exist

      // if email exist throw err message
      if (emailExist)
        return res
          .status(400)
          .send({ alert: "User already Exist, try with new email id" });

      // gen salt using bcrpt
      const salt = await bcrypt.genSalt(10);
      console.log("random string ", salt); // 10 times random string

      // hash password with salt ; it'll stored in db;
      req.body.password = await bcrypt.hash(req.body.password, salt); // gives encrpted string for password. then assign to password body

      console.log("encrpted password", req.body.password); // now its encrpted string

      // post the user data to db;
      const postData = await mongo.register.insertOne(req.body);
      console.log(postData); // userDetails reg

      res.status(201).send("User registered successfully");
    } catch (err) {
      console.log("err in registration", err);
    }
  },
};

module.exports = service;
