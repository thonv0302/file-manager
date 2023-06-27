const JWT = require('jsonwebtoken');
const { AuthFailureError, NotFoundError } = require('../core/error.response');
const asyncHandler = require('../helpers/asyncHandler');
const { secretKey } = require('../configs/jwt.config');
const HEADER = {
  AUTHORIZATION: 'authorization',
  REFRESHTOKEN: 'x-rtoken-id',
};

const authentication = asyncHandler(async (req, res, next) => {
  const authorizationHeader = req.headers[HEADER.AUTHORIZATION];
  const accessToken = authorizationHeader.split(' ')[1];
  if (!accessToken) {
    throw new AuthFailureError('Invalid Request');
  }
  try {
    const decodeUser = JWT.verify(accessToken, secretKey);
    req.user = decodeUser;
    next();
  } catch (error) {
    throw new AuthFailureError('Invalid Request 2');
  }
});

module.exports = {
  authentication,
};
