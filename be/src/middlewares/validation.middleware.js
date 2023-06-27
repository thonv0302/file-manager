const asyncHandler = require('../helpers/asyncHandler');

const validate = (schema) =>
  asyncHandler(async (req, res, next) => {
    await schema.validateAsync(req.body);
    next();
  });

module.exports = {
  validate,
};
