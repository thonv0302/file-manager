import apiClient from './index';
import addRequestToken from '../helpers/addRequestToken';

const getUrl = async (key) => {
  try {
    return await apiClient.post(
      'url',
      {
        key,
      },
      addRequestToken
    );
  } catch (error) {
    throw new Error(error)
  }
};

const getUploadUrls = async (keys) => {
  try {
    return await apiClient.post(
      'put-urls',
      {
        keys,
      },
      addRequestToken
    );
  } catch (error) {
    throw new Error(error)
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
  } catch (error) { }
};

export default {
  getUrl,
  getUploadUrls,
  uploadFile,
};
