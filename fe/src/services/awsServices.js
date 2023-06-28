import apiClient from './index';
import addRequestToken from '../helpers/addRequestToken';

const getUrl = async (key) => {
  let response;
  try {
    return await apiClient.post(
      'url',
      {
        key,
      },
      addRequestToken
    );
  } catch (error) {
    throw new Error(error);
  }
};

const getUploadUrls = async (keys) => {
  let response;
  try {
    response = await apiClient.post(
      'put-urls',
      {
        keys,
      },
      addRequestToken
    );
    return response.data.metadata;
  } catch (error) {
    throw new Error(error);
  }
};

const uploadFile = async (file, url, cb) => {
  try {
    return await apiClient.put(url, file, {
      headers: { 'Content-Type': file.type },
      onUploadProgress: (processEvent) => {
        const percent = (processEvent.loaded * 100) / processEvent.total;
        cb(percent);
      },
    });
  } catch (error) {
    throw new Error(error);
  }
};

export default {
  getUrl,
  getUploadUrls,
  uploadFile,
};
