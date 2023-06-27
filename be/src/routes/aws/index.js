'use strict';

const express = require('express');
const AwsController = require('../../controllers/aws.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const router = express.Router();

router.post('/url', asyncHandler(AwsController.getUrl));
router.post('/put-urls', asyncHandler(AwsController.getUploadUrls));

module.exports = router;
