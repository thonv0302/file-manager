import apiClient from './index';
import addRequestToken from '../helpers/addRequestToken';

const getBlock = async (params, query = {}) => {
  let response;
  let blockId = '';
  if (params.blockId) {
    blockId = params.blockId;
  }
  try {
    response = await apiClient.get(`block/${blockId}`, {
      params: query,
      ...addRequestToken,
    });

    return response.data.metadata;
  } catch (error) {
    console.log('error: ', error);
  }
};

const createBlock = async (body) => {
  let response;
  try {
    response = await apiClient.post('block', body, addRequestToken);
    return response.data.metadata;
  } catch (error) {
    console.log('error: ', error);
  }
};

const getOneBlock = async (blockId) => {
  let response;
  try {
    response = await apiClient.get(`block/getOne/${blockId}`, addRequestToken);
    return response.data.metadata;
  } catch (error) {
    console.log('error: ', error);
  }
};

const updateBlock = async (blockId, body) => {
  let response;
  try {
    response = await apiClient.put(`block/${blockId}`, body, addRequestToken);
    return response.data.metadata;
  } catch (error) {
    console.log('error: ', error);
  }
};

const generateBreadcrumb = async (blockId) => {
  let response;
  try {
    response = await apiClient.get(
      `block/generateBread/${blockId}`,
      addRequestToken
    );
    return response.data.metadata;
  } catch (error) {
    console.log('error: ', error);
  }
};

const generateName = async (body) => {
  let response;
  try {
    response = await apiClient.post(
      `block/generateName`,
      body,
      addRequestToken
    );
    return response.data.metadata;
  } catch (error) {
    console.log('error: ', error);
  }
};

export default {
  getBlock,
  createBlock,
  getOneBlock,
  updateBlock,
  generateBreadcrumb,
  generateName,
};
