const mongo = require("../Shared/mongo");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const sendMail = require("../Shared/sendMailer");
const { ObjectId, ReturnDocument } = require("mongodb"); //driver

const service = {
  async sendToken(req, res, next) {
    let userExist = await mongo.register.findOne({ email: req.body.email });
    console.log(userExist);
    console.log("reset user choosed");
    // res.status(200).send({ key: "user result done", result: userExist });
    //check exist or not
    if (!userExist) res.status(400).send("user doesn't exists");

    //if user reset token was not used , remove the reset token unset

    if (userExist.resetToken) {
      let data = await mongo.register.update(
        { email: userExist.email },
        { $unset: { resetToken: 1, resetExpire: 1 } }
      );
      console.log(data);
    }

    // create string for hashing pass;
    let token = crypto.randomBytes(32).toString("hex");
    console.log(token);
    //generation hash reset token
    let hashToken = await bcrypt.hash(token, Number(12));

    console.log("hashTOken: ", hashToken);
    //expiry timing for 1 hour
    let expiry = new Date(Date.now() + 1 * 3600 * 1000);
    console.log(expiry);

    //updating resetToken and expiry time to user details;
    let data = await mongo.register.findOneAndUpdate(
      { email: userExist.email },
      { $set: { resetToken: hashToken, resetExpire: expiry } },
      { ReturnDocument: "after" }
    );
    console.log(data);

    res.status(200).send({
      message: "Link sent to email",
      Id: data.value._id,
      resetToken: hashToken,
    });
  },

  //verify resetToken and expiry time
  async verifyToken(req, res, next) {
    const userExist = await mongo.register.findOne({
      _id: ObjectId(req.params.userId),
    });
    console.log("verify token :", userExist);

    const token = req.params.token;

    console.log("token:", token);

    //verifing token compare to db resetToken
    const isValid = await bcrypt.compare(token, userExist.resetToken);

    // verify expiry timing
    const isExpired = userExist.resetExpire > Date.now();

    console.log("current time", Date.now);

    //both are valid
    if (isValid && isExpired) {
      res.status(200).send({ message: true });
    } else {
      res.status(400).send({ Error: "invalid link or Expired " });
    }
  },

  async verifyAndUpdatePassword(req, res, next) {
    let userExist=await mongo.register.findOne({_id:ObjectId(req.params.userId)});
    if(!userExist.resetToken) return res.status(400).send("invalid link or expired");

    const token=req.params.token;

    const isValid=await bcrypt.compare(token,userExist.resetToken);


    const isExpired= userExist.resetExpire>Date.now(); //ex  expiry time is 10am , current time is 10.01 am . false

    console.log(`Current time : ${Date.now()} , expiry time is : ${userExist.resetExpire}`);

    if(isValid && isExpired){
      const password=req.body.password;
      const hashPass=await bcrypt.hash(password,Number(12));

      console.log("new pass: ", hashPass);
      
      const data=await mongo.register.findOneAndUpdate({_id: ObjectId(req.params.userId)},{$set:{password:hashPass},{$unset:{resetToken:1,resetExpire:1}},{ReturnDocument:"after"});
      console.log(data);
      res.status(200).send({message:"password updated successfully"});

    }
    else res.status(400).send("Invalid link or expired")
   
  },
};

module.exports = service;
