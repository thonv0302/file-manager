const Joi = require('joi');

const loginValidation = Joi.object().keys({
  email: Joi.string().trim().email().required(),
  password: Joi.string().trim().min(6).required(),
});

const registerValidation = Joi.object().keys({
  email: Joi.string().trim().email().required(),
  password: Joi.string().trim().min(6).required(),
});
module.exports = {
  loginValidation,
  registerValidation,
};
