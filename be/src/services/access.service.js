'use strict';

const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { NotFoundError, BadRequestError } = require('../core/error.response');
const { getInfoData } = require('../utils');
const { generateAccessToken } = require('../helpers/generateToken');
const { secretKey } = require('../configs/jwt.config');

class AccessService {
  login = async ({ email, password }) => {
    const userFound = await userModel.findOne({ email }).lean();
    if (!userFound) {
      throw new NotFoundError('Email or password is invalid!');
    }

    const passwordMatch = await bcrypt.compare(password, userFound.password);

    if (!passwordMatch) {
      throw new NotFoundError('Email or password is invalid!');
    }

    const accessToken = await generateAccessToken(
      {
        userId: userFound._id.toString(),
        email,
      },
      secretKey
    );

    return {
      user: getInfoData({
        fields: ['_id', 'email'],
        object: userFound,
      }),
      accessToken,
    };
  };
  register = async ({ email, password }) => {
    const userFound = await userModel.findOne({ email }).lean();

    if (userFound) {
      throw new NotFoundError('Email is already registered!');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      email,
      password: passwordHash,
    });

    if (newUser) {
      const accessToken = await generateAccessToken(
        {
          userId: newUser._id.toString(),
          email,
        },
        secretKey
      );

      return {
        user: getInfoData({
          fields: ['_id', 'email'],
          object: newUser,
        }),
        accessToken,
      };
    }
  };
}

module.exports = new AccessService();
