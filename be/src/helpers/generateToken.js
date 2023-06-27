'use strict';
const JWT = require('jsonwebtoken');
const asyncHandler = require('../helpers/asyncHandler');

// const generateAccessToken = asyncHandler(async (payload, secretKey) => {
//   const accessToken = await JWT.sign(payload, secretKey, {
//     expiresIn: '2 days',
//   });
//   return accessToken;
// });

const generateAccessToken = async (payload, secretKey) => {
  try {
    const accessToken = await JWT.sign(payload, secretKey, {
      expiresIn: '2 days',
    });
    return accessToken;
  } catch (error) {
    console.log('error: ', error);
  }
};

module.exports = {
  generateAccessToken,
};
