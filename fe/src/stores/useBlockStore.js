import { defineStore } from 'pinia';
import blockService from '../services/blockService';
import { ref } from 'vue';

export const useBlockStore = defineStore('blockStore', () => {
  const listBlock = ref([]);
  const listBreadCrumb = ref([]);
  const getBlock = async (params, query = {}) => {
    listBlock.value = await blockService.getBlock(params, query);
  };

  const createBlock = async (body) => {
    return await blockService.createBlock(body);
  };

  const checkFolderAndFileNameExist = async (body) => {
    return await blockService.checkFolderAndFileNameExist(body);
  };

  const getOneBlock = async (blockId) => {
    return await blockService.getOneBlock(blockId);
  };

  const updateBlock = async (blockId, body) => {
    return await blockService.updateBlock(blockId, body);
  };

  const getBreadcrumb = async (blockId) => {
    listBreadCrumb.value = await blockService.generateBreadcrumb(blockId);
  };

  const generateName = async (body) => {
    return await blockService.generateName(body);
  };

  const caclSizeFolder = async (blockId) => {
    return await blockService.calculateSize(blockId);
  };

  const deleteBlocks = async (listBlockId) => {
    return await blockService.deleteBlocks(listBlockId);
  };

  return {
    listBlock,
    getBlock,
    createBlock,
    checkFolderAndFileNameExist,
    getOneBlock,
    updateBlock,
    getBreadcrumb,
    listBreadCrumb,
    generateName,
    caclSizeFolder,
    deleteBlocks,
  };
});
