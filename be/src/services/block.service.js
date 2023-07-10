const blockModel = require('../models/block.model');
const { Types } = require('mongoose');
const { ErrorResponse } = require('../core/error.response');
const { omit } = require('lodash');
const { getNameIndexAndExtension } = require('../utils/cutSuffixName');
const { sortBy } = require('../helpers/sortBy');

class BlockModel {
  getMany = async (req) => {
    const query = {
      ...req.query,
      parentFolder: req.params.parentFolder || '',
    };

    const objSort = sortBy(query);
    const queryObj = omit(query, ['_sort', '_order']);
    return await blockModel.find(queryObj).sort(objSort);
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

  calculateSize = async (parentFolder) => {
    let blockCurrentId = parentFolder;
    while (blockCurrentId) {
      let dataFound = await blockModel.findOne({
        _id: blockCurrentId,
      });

      if (dataFound) {
        const blocks = await blockModel.find({
          parentFolder: blockCurrentId,
        });

        //-- Update folder size
        const totalSize = blocks.reduce((total, block) => {
          return total + block.size;
        }, 0);

        await blockModel.updateOne(
          { _id: blockCurrentId },
          {
            size: totalSize,
          }
        );
        blockCurrentId = dataFound.parentFolder;
      } else {
        blockCurrentId = null;
      }
    }

    return {
      msg: 'Update size successful!',
    };
  };

  deleteBlocks = async (listBlockId) => {
    return await blockModel.deleteMany({
      $or: [
        { _id: { $in: listBlockId } },
        {
          ancestorFolders: {
            $elemMatch: {
              $in: listBlockId,
            },
          },
        },
      ],
    });
  };
}

module.exports = new BlockModel();
