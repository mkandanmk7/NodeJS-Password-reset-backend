const mongo = require("../Shared/mongo");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const { reqisterSchema, registerSchema } = require("../Shared/schema");

const service = {
  async register(req, res) {
    try {
      //validation using joi schema
      const { value, error } = await registerSchema.validate(req.body);
      console.log(value);
    } catch (err) {
      console.log("err in validation", err);
    }
  },
};

module.exports = service;
