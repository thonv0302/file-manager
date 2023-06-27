const BlockService = require('../services/block.service');
const { SuccessResponse, CREATED } = require('../core/success.response');

class BlockController {
  getMany = async (req, res, next) => {
    new SuccessResponse({
      metadata: await BlockService.getMany(req),
    }).send(res);
  };

  getOne = async (req, res, next) => {
    new SuccessResponse({
      metadata: await BlockService.getOne(req.params.blockId),
    }).send(res);
  };

  create = async (req, res, next) => {
    new CREATED({
      metadata: await BlockService.create(req.body),
    }).send(res);
  };

  updateOne = async (req, res, next) => {
    new SuccessResponse({
      metadata: await BlockService.updateOne(req.params.blockId, req.body),
    }).send(res);
  };

  generateBreadcrumbArr = async (req, res, next) => {
    new SuccessResponse({
      metadata: await BlockService.generateBreadcrumb(req.params.blockId),
    }).send(res);
  };

  generateName = async (req, res, next) => {
    new SuccessResponse({
      metadata: await BlockService.addNameWithSuffix(req.body),
    }).send(res);
  };
}

module.exports = new BlockController();
