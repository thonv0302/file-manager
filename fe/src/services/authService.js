import apiClient from './index';

const login = ({ email, password }) => {
  try {
    return apiClient.post('login', {
      email,
      password,
    });
  } catch (error) {
    console.log('error: ', error);
  }
};

const register = ({ email, password }) => {
  try {
    return apiClient.post('register', {
      email,
      password,
    });
  } catch (error) {
    console.log('error: ', error);
  }
};

export default {
  login,
  register,
};
