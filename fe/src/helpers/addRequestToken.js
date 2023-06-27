import { useLocalStorage } from '@vueuse/core';

const addRequestToken = () => {
  return {
    headers: {
      Authorization: `Bearer ${
        JSON.parse(useLocalStorage('metadata').value).accessToken
      }`,
    },
  };
};

export default addRequestToken();
