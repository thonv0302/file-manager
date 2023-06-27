const blockModel = require('../models/block.model');
const { Types } = require('mongoose');
const { ErrorResponse } = require('../core/error.response');

const { getNameIndexAndExtension } = require('../utils/cutSuffixName');
class BlockModel {
  getMany = async (req) => {
    const query = {
      ...req.query,
      parentFolder: req.params.parentFolder || '',
    };

    return await blockModel.find(query).sort({ createdAt: -1 });
  };

  getOne = async (blockId) => {
    return await blockModel.findOne({ _id: blockId });
  };

  updateOne = async (id, body) => {
    return await blockModel.updateOne(
      { _id: id },
      {
        ...body,
      }
    );
  };

  generateBreadcrumb = async (currentId) => {
    const data = [];
    let blockCurrentId = currentId;
    let dataFound;
    while (blockCurrentId) {
      dataFound = await blockModel.findOne({
        _id: blockCurrentId,
      });
      if (dataFound) {
        data.unshift({
          id: dataFound._id,
          name: dataFound.name,
        });
        blockCurrentId = dataFound.parentFolder.toString();
      } else {
        blockCurrentId = null;
      }
    }

    return data;
  };

  addSuffixName = async ({ name, parentFolder }) => {
    const { nameSplit, index, extension } = getNameIndexAndExtension(name);

    let suffix = index + 1;

    while (
      await blockModel.findOne({
        name: `${nameSplit} (${suffix})${extension}`,
        parentFolder,
      })
    ) {
      suffix++;
    }

    return `${nameSplit} (${suffix})${extension}`;
  };

  addNameWithSuffix = async (body) => {
    const existName = await blockModel.findOne({
      name: body.name,
      parentFolder: body.parentFolder,
    });

    if (existName) {
      return await this.addSuffixName(body);
    }

    return body.name;
  };

  create = async (body) => {
    const generateName = await this.addNameWithSuffix(body);
    body.name = generateName;
    return await blockModel.create(body);
  };
}

module.exports = new BlockModel();