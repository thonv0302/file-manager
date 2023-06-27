'use strict';

const express = require('express');
const AccessController = require('../../controllers/access.controller');
const router = express.Router();
const asyncHandler = require('../../helpers/asyncHandler');
const { validate } = require('../../middlewares/validation.middleware');
const {
  loginValidation,
  registerValidation,
} = require('../../validations/auth.validate');

// Signup
router.post(
  '/login',
  validate(loginValidation),
  asyncHandler(AccessController.login)
);
router.post(
  '/register',
  validate(registerValidation),
  asyncHandler(AccessController.register)
);

module.exports = router;
