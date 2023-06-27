'use strict';

const express = require('express');
const router = express.Router();
const { authentication } = require('../middlewares/auth.middleware');

router.use('/v1/api', require('./access'));

router.use(authentication);

router.use('/v1/api', require('./aws'));
router.use('/v1/api/block', require('./block'));

module.exports = router;
