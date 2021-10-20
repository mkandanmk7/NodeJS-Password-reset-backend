const joi = require("joi");

const schema = {
  registerSchema: joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().alphanum().min(6).max(12).required(),
  }),
  loginSchema: joi.object({
    email: joi.string().email().required(),
    password: joi.string().alphanum().min(6).max(12).required(),
  }),
};

module.exports = schema;
