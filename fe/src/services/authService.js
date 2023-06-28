import apiClient from './index';

const login = ({ email, password }) => {
  try {
    return apiClient.post('login', {
      email,
      password,
    });
  } catch (error) {
    throw new Error(error);
  }
};

const register = ({ email, password }) => {
  try {
    return apiClient.post('register', {
      email,
      password,
    });
  } catch (error) {
    throw new Error(error);
  }
};

export default {
  login,
  register,
};
