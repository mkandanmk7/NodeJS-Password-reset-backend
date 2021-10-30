// const { ObjectId } = require("mongodb");
const mongo = require("../Shared/mongo");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const { registerSchema, loginSchema } = require("../Shared/schema");

const service = {
  // register data service
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

  // login user service (JWT)
  async login(req, res) {
    try {
      //joi loginschema validation
      const { value, error } = await loginSchema.validate(req.body);

      if (error)
        return res.status(400).send({ Error: error.details[0].message });

      //check first email exist;
      const emailExist = await mongo.register.findOne({
        email: req.body.email,
      });
      //not exist
      if (!emailExist)
        return res.status(404).send({ Alert: "User not found,Please Sign up" });

      //check password valid or not bcrypt.campare
      const passValid = await bcrypt.compare(
        req.body.password,
        emailExist.password
      ); //compare with orignal pass and typed password;

      if (!passValid)
        return res.status(400).send({ Alert: "Enter the correctPassword" });

      //gen Token using jwt
      const token = jwt.sign(
        {
          userId: emailExist._id,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "8h" }
      );
      console.log(token);

      res.status(200).send({ Alert: "Login successfully", token: token });
    } catch (err) {
      console.log("error in login", err);
    }
  },
};

module.exports = service;
