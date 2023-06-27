const AwsService = require('../services/aws.service');
const { SuccessResponse } = require('../core/success.response');

class AwsController {
  getUrl = async (req, res, next) => {
    new SuccessResponse({
      metadata: await AwsService.getUrl(req.body),
    }).send(res);
  };

  getUploadUrls = async (req, res, next) => {
    new SuccessResponse({
      metadata: await AwsService.getUploadUrls(req.body),
    }).send(res);
  };
}

module.exports = new AwsController();
