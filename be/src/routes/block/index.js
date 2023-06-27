'use strict';

const express = require('express');
const BlockController = require('../../controllers/block.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const router = express.Router();

router.get('/:parentFolder?', asyncHandler(BlockController.getMany));
router.get('/getOne/:blockId', asyncHandler(BlockController.getOne));
router.post('', asyncHandler(BlockController.create));
router.post('/generateName', asyncHandler(BlockController.generateName));
router.put('/:blockId', asyncHandler(BlockController.updateOne));
router.get(
  '/generateBread/:blockId',
  asyncHandler(BlockController.generateBreadcrumbArr)
);
module.exports = router;
